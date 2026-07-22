import hmac
import os
import re
from datetime import datetime, timezone
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient, ReturnDocument
import pymongo

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")
if not MONGO_URL:
    raise RuntimeError(
        "MONGO_URL is not set. Copy backend/.env.example to backend/.env "
        "and fill in your MongoDB connection string."
    )

DB_NAME = os.environ.get("MONGO_DB", "CoffeeShop")
COLLECTION_NAME = os.environ.get("MONGO_COLLECTION", "coffee")

# Admin passcode for product management. If unset, all write endpoints are
# refused (fail closed) rather than left open.
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]        # coffee orders
products = db["products"]               # the menu the kiosk shows
# Dedicated collection used to hand out monotonically increasing order ids
# atomically, instead of guessing from the last document in memory.
counters = db["counters"]

app = Flask(__name__, static_folder="static", static_url_path="/static")

_origins = os.environ.get("CORS_ORIGINS", "*")
origins = "*" if _origins.strip() == "*" else [o.strip() for o in _origins.split(",") if o.strip()]
CORS(app, resources={r"/*": {"origins": origins}})

# Valid temperature values.
ALLOWED_TEMPS = {"hot", "cold"}

# Fields required in a /bill request and the type each must be.
ORDER_REQUIRED_FIELDS = {
    "name": str,
    "price": (int, float),
    "temp": str,
}


# --------------------------------------------------------------------------- #
# Admin auth
# --------------------------------------------------------------------------- #
def require_admin(view):
    """Guard write endpoints with a constant-time check of the admin token."""

    @wraps(view)
    def wrapper(*args, **kwargs):
        if not ADMIN_TOKEN:
            return jsonify({"error": "Admin API is not configured (ADMIN_TOKEN unset)."}), 503
        supplied = request.headers.get("X-Admin-Token", "")
        if not hmac.compare_digest(supplied, ADMIN_TOKEN):
            return jsonify({"error": "Unauthorized."}), 401
        return view(*args, **kwargs)

    return wrapper


# --------------------------------------------------------------------------- #
# Orders
# --------------------------------------------------------------------------- #
def _next_order_id():
    """Atomically increment and return the next order id."""
    doc = counters.find_one_and_update(
        {"_id": "order_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return doc["seq"]


def _validate_order(data):
    """Return (cleaned_dict, None) on success or (None, error_message)."""
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    cleaned = {}
    for field, expected_type in ORDER_REQUIRED_FIELDS.items():
        if field not in data:
            return None, f"Missing required field: '{field}'."
        value = data[field]
        if not isinstance(value, expected_type) or isinstance(value, bool):
            return None, f"Field '{field}' has an invalid type."
        cleaned[field] = value
    if cleaned["price"] < 0:
        return None, "Field 'price' must be non-negative."
    cleaned["name"] = cleaned["name"].strip()
    cleaned["temp"] = cleaned["temp"].strip().lower()
    if not cleaned["name"]:
        return None, "Field 'name' must not be empty."
    if cleaned["temp"] not in ALLOWED_TEMPS:
        return None, "Field 'temp' must be one of: hot, cold."

    # Sweetness is optional (some drinks, e.g. Americano, have no sweetness).
    sweetness = data.get("sweetness")
    if sweetness is not None and (
        not isinstance(sweetness, (int, float)) or isinstance(sweetness, bool)
    ):
        return None, "Field 'sweetness' must be a number or null."
    cleaned["sweetness"] = sweetness

    return cleaned, None


# --------------------------------------------------------------------------- #
# Products (the editable menu)
# --------------------------------------------------------------------------- #
def _slugify(text):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "item"


def _unique_slug(base):
    slug, n = base, 2
    while products.find_one({"_id": slug}):
        slug = f"{base}-{n}"
        n += 1
    return slug


def _validate_product(data, partial=False):
    """Validate a product payload. `partial=True` allows a subset (for PATCH)."""
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."

    cleaned = {}

    def want(field):
        return field in data

    # name
    if want("name"):
        if not isinstance(data["name"], str) or not data["name"].strip():
            return None, "Field 'name' must be a non-empty string."
        cleaned["name"] = data["name"].strip()
    elif not partial:
        return None, "Missing required field: 'name'."

    # price
    if want("price"):
        price = data["price"]
        if not isinstance(price, (int, float)) or isinstance(price, bool) or price < 0:
            return None, "Field 'price' must be a non-negative number."
        cleaned["price"] = price
    elif not partial:
        return None, "Missing required field: 'price'."

    # optional strings
    for field in ("nameThai", "image", "category"):
        if want(field):
            if not isinstance(data[field], str):
                return None, f"Field '{field}' must be a string."
            cleaned[field] = data[field].strip()

    # optional booleans
    for field in ("hasSweetness", "available"):
        if want(field):
            if not isinstance(data[field], bool):
                return None, f"Field '{field}' must be true or false."
            cleaned[field] = data[field]

    # sortOrder
    if want("sortOrder"):
        so = data["sortOrder"]
        if not isinstance(so, (int, float)) or isinstance(so, bool):
            return None, "Field 'sortOrder' must be a number."
        cleaned["sortOrder"] = so

    if partial and not cleaned:
        return None, "No valid fields to update."

    return cleaned, None


def _with_defaults(cleaned):
    """Fill defaults for a newly created product."""
    return {
        "name": cleaned["name"],
        "nameThai": cleaned.get("nameThai", ""),
        "price": cleaned["price"],
        "hasSweetness": cleaned.get("hasSweetness", True),
        "image": cleaned.get("image", ""),
        "category": cleaned.get("category", ""),
        "available": cleaned.get("available", True),
        "sortOrder": cleaned.get("sortOrder", 100),
    }


# Seed data mirrors the drinks the app originally hardcoded.
_SEED_PRODUCTS = [
    {"_id": "mocca", "name": "Mocca", "nameThai": "มอคค่า", "price": 50, "hasSweetness": True, "sortOrder": 10,
     "image": "https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg"},
    {"_id": "americano", "name": "Americano", "nameThai": "อเมริกาโน่", "price": 50, "hasSweetness": False, "sortOrder": 20,
     "image": "https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg"},
    {"_id": "espresso", "name": "Espresso", "nameThai": "เอสเพรสโซ่", "price": 50, "hasSweetness": True, "sortOrder": 30,
     "image": "https://www.thespruceeats.com/thmb/HJrjMfXdLGHbgMhnM0fMkDx9XPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-espresso-765702-hero-03_cropped-ffbc0c7cf45a46ff846843040c8f370c.jpg"},
    {"_id": "cappuccino", "name": "Cappuccino", "nameThai": "คาปูชิโน่", "price": 50, "hasSweetness": True, "sortOrder": 40,
     "image": "https://coffeeaffection.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg"},
    {"_id": "latte", "name": "Latte", "nameThai": "ลาเต้", "price": 50, "hasSweetness": True, "sortOrder": 50,
     "image": "https://coffeeaffection.com/wp-content/uploads/2021/05/Spanish-latte-milk-and-espresso.jpg"},
]


def seed_products_if_empty():
    """Populate the menu once, so a fresh database is not blank."""
    try:
        if products.estimated_document_count() == 0:
            docs = [_with_defaults(p) | {"_id": p["_id"]} for p in _SEED_PRODUCTS]
            products.insert_many(docs)
            app.logger.info("Seeded %d products.", len(docs))
    except pymongo.errors.PyMongoError:
        app.logger.exception("Product seeding failed")


@app.route("/products", methods=["GET"])
def list_products():
    """Public: the menu the kiosk renders. Only available items by default."""
    show_all = request.args.get("all") in ("1", "true", "yes")
    if show_all:
        # Listing hidden items is an admin action.
        if not ADMIN_TOKEN or not hmac.compare_digest(
            request.headers.get("X-Admin-Token", ""), ADMIN_TOKEN
        ):
            return jsonify({"error": "Unauthorized."}), 401
        query = {}
    else:
        query = {"available": True}
    items = list(products.find(query).sort([("sortOrder", 1), ("name", 1)]))
    return jsonify(items), 200


@app.route("/products", methods=["POST"])
@require_admin
def create_product():
    body = request.get_json(silent=True)
    cleaned, error = _validate_product(body, partial=False)
    if error:
        return jsonify({"error": error}), 400
    doc = _with_defaults(cleaned)
    # Use a caller-supplied id if given, else derive a slug from the name.
    requested_id = (body or {}).get("id") or doc["name"]
    doc["_id"] = _unique_slug(_slugify(requested_id))
    try:
        products.insert_one(doc)
    except pymongo.errors.PyMongoError:
        app.logger.exception("Failed to create product")
        return jsonify({"error": "Could not create product."}), 500
    return jsonify(doc), 201


@app.route("/products/<pid>", methods=["PUT", "PATCH"])
@require_admin
def update_product(pid):
    cleaned, error = _validate_product(request.get_json(silent=True), partial=True)
    if error:
        return jsonify({"error": error}), 400
    result = products.find_one_and_update(
        {"_id": pid}, {"$set": cleaned}, return_document=ReturnDocument.AFTER
    )
    if result is None:
        return jsonify({"error": "Product not found."}), 404
    return jsonify(result), 200


@app.route("/products/<pid>", methods=["DELETE"])
@require_admin
def delete_product(pid):
    result = products.delete_one({"_id": pid})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found."}), 404
    return jsonify({"deleted": pid}), 200


# --------------------------------------------------------------------------- #
# Misc routes
# --------------------------------------------------------------------------- #
@app.route("/")
def hello_world():
    return "<p>Coffee backend is running. Admin at <a href='/admin'>/admin</a>.</p>"


@app.route("/admin")
def admin_page():
    return send_from_directory(app.static_folder, "admin.html")


@app.route("/coffee", methods=["GET"])
@require_admin
def get_all_coffee():
    # Order history is customer data — no longer public. Kept for compatibility;
    # prefer /orders, which is sorted and includes a summary.
    coffee = list(collection.find())
    return jsonify(coffee), 200


@app.route("/orders", methods=["GET"])
@require_admin
def list_orders():
    """Admin: customer purchase history, newest first, with a summary."""
    orders = list(collection.find().sort([("createdAt", -1), ("_id", -1)]))
    revenue = sum(o.get("price", 0) for o in orders)
    summary = {"count": len(orders), "revenue": revenue}
    return jsonify({"orders": orders, "summary": summary}), 200


@app.route("/bill", methods=["POST"])
def bill():
    data = request.get_json(silent=True)
    cleaned, error = _validate_order(data)
    if error:
        return jsonify({"error": error}), 400

    new_coffee = {
        "_id": _next_order_id(),
        **cleaned,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    try:
        collection.insert_one(new_coffee)
    except pymongo.errors.PyMongoError:
        # Log the real error server-side; don't leak internals to the client.
        app.logger.exception("Failed to insert order")
        return jsonify({"error": "Could not save order."}), 500

    return jsonify(new_coffee), 201


seed_products_if_empty()


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=debug)
