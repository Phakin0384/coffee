import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
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

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]
# Dedicated collection used to hand out monotonically increasing order ids
# atomically, instead of guessing from the last document in memory.
counters = db["counters"]

app = Flask(__name__)

_origins = os.environ.get("CORS_ORIGINS", "*")
origins = "*" if _origins.strip() == "*" else [o.strip() for o in _origins.split(",") if o.strip()]
CORS(app, resources={r"/*": {"origins": origins}})

# Fields required in a /bill request and the type each must be.
REQUIRED_FIELDS = {
    "name": str,
    "price": (int, float),
    "temp": str,
}

# Valid temperature values.
ALLOWED_TEMPS = {"hot", "cold"}


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
    for field, expected_type in REQUIRED_FIELDS.items():
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


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/coffee", methods=["GET"])
def get_all_coffee():
    coffee = list(collection.find())
    return jsonify(coffee), 200


@app.route("/bill", methods=["POST"])
def bill():
    data = request.get_json(silent=True)
    cleaned, error = _validate_order(data)
    if error:
        return jsonify({"error": error}), 400

    new_coffee = {"_id": _next_order_id(), **cleaned}

    try:
        collection.insert_one(new_coffee)
    except pymongo.errors.PyMongoError:
        # Log the real error server-side; don't leak internals to the client.
        app.logger.exception("Failed to insert order")
        return jsonify({"error": "Could not save order."}), 500

    return jsonify(new_coffee), 201


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=debug)
