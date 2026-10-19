"""Tests for the coffee backend: validation helpers and HTTP routes."""
from conftest import ADMIN_HEADERS


# --------------------------------------------------------------------------- #
# Validation helpers (pure functions)
# --------------------------------------------------------------------------- #
class TestOrderValidation:
    def test_valid_order(self, app_module):
        cleaned, err = app_module._validate_order(
            {"productId": "mocca", "temp": "hot", "sweetness": 75}
        )
        assert err is None
        assert cleaned == {"productId": "mocca", "temp": "hot", "sweetness": 75}

    def test_client_name_and_price_are_dropped(self, app_module):
        # Name and price come from the products collection, never the client.
        cleaned, err = app_module._validate_order(
            {"productId": "mocca", "temp": "hot", "name": "Free", "price": 0}
        )
        assert err is None
        assert "name" not in cleaned and "price" not in cleaned

    def test_sweetness_optional(self, app_module):
        cleaned, err = app_module._validate_order({"productId": "americano", "temp": "cold"})
        assert err is None
        assert cleaned["sweetness"] is None

    def test_temp_normalized_and_checked(self, app_module):
        cleaned, err = app_module._validate_order({"productId": "latte", "temp": "HOT"})
        assert err is None and cleaned["temp"] == "hot"

        _, err = app_module._validate_order({"productId": "latte", "temp": "warm"})
        assert err is not None

    def test_missing_product_id(self, app_module):
        _, err = app_module._validate_order({"temp": "hot"})
        assert "productId" in err

    def test_bad_product_id(self, app_module):
        for pid in (123, "", "   ", None, True):
            _, err = app_module._validate_order({"productId": pid, "temp": "hot"})
            assert err is not None, pid

    def test_bad_sweetness_type(self, app_module):
        _, err = app_module._validate_order(
            {"productId": "mocca", "temp": "hot", "sweetness": "lots"}
        )
        assert err is not None

    def test_bool_not_accepted_as_sweetness(self, app_module):
        _, err = app_module._validate_order(
            {"productId": "mocca", "temp": "hot", "sweetness": True}
        )
        assert err is not None


class TestProductValidation:
    def test_valid_create(self, app_module):
        cleaned, err = app_module._validate_product({"name": "Tea", "price": 40})
        assert err is None and cleaned["name"] == "Tea" and cleaned["price"] == 40

    def test_missing_name(self, app_module):
        _, err = app_module._validate_product({"price": 40})
        assert "name" in err

    def test_missing_price(self, app_module):
        _, err = app_module._validate_product({"name": "Tea"})
        assert "price" in err

    def test_partial_update(self, app_module):
        cleaned, err = app_module._validate_product({"price": 42}, partial=True)
        assert err is None and cleaned == {"price": 42}

    def test_partial_empty(self, app_module):
        _, err = app_module._validate_product({}, partial=True)
        assert err is not None

    def test_bad_boolean(self, app_module):
        _, err = app_module._validate_product(
            {"name": "Tea", "price": 40, "available": "yes"}
        )
        assert err is not None


class TestSlug:
    def test_slugify(self, app_module):
        assert app_module._slugify("Thai Tea Latte!") == "thai-tea-latte"
        assert app_module._slugify("   ") == "item"

    def test_unique_slug(self, app_module):
        # "mocca" already exists from the seed.
        assert app_module._unique_slug("mocca") == "mocca-2"


# --------------------------------------------------------------------------- #
# Product routes
# --------------------------------------------------------------------------- #
class TestProductRoutes:
    def test_public_list_seeded(self, client):
        r = client.get("/products")
        assert r.status_code == 200
        assert len(r.get_json()) == 5

    def test_admin_list_requires_token(self, client):
        assert client.get("/products?all=1").status_code == 401
        r = client.get("/products?all=1", headers=ADMIN_HEADERS)
        assert r.status_code == 200

    def test_create_requires_token(self, client):
        r = client.post("/products", json={"name": "Tea", "price": 40})
        assert r.status_code == 401

    def test_create_and_appears(self, client):
        r = client.post(
            "/products", json={"name": "Thai Tea", "price": 55}, headers=ADMIN_HEADERS
        )
        assert r.status_code == 201
        assert r.get_json()["_id"] == "thai-tea"
        assert len(client.get("/products").get_json()) == 6

    def test_create_invalid(self, client):
        r = client.post(
            "/products", json={"name": "Bad", "price": -5}, headers=ADMIN_HEADERS
        )
        assert r.status_code == 400

    def test_update(self, client):
        r = client.put(
            "/products/mocca", json={"price": 60}, headers=ADMIN_HEADERS
        )
        assert r.status_code == 200 and r.get_json()["price"] == 60

    def test_update_missing(self, client):
        r = client.put(
            "/products/nope", json={"price": 10}, headers=ADMIN_HEADERS
        )
        assert r.status_code == 404

    def test_delete(self, client):
        assert client.delete("/products/latte", headers=ADMIN_HEADERS).status_code == 200
        assert len(client.get("/products").get_json()) == 4

    def test_hidden_excluded_from_public(self, client):
        client.post(
            "/products",
            json={"name": "Secret", "price": 30, "available": False},
            headers=ADMIN_HEADERS,
        )
        public_ids = [p["_id"] for p in client.get("/products").get_json()]
        all_ids = [
            p["_id"] for p in client.get("/products?all=1", headers=ADMIN_HEADERS).get_json()
        ]
        assert "secret" not in public_ids
        assert "secret" in all_ids


# --------------------------------------------------------------------------- #
# Cup art (the drawn cup the kiosk shows for each product)
# --------------------------------------------------------------------------- #
class TestCupArt:
    def get(self, client, pid):
        items = client.get("/products?all=1", headers=ADMIN_HEADERS).get_json()
        return next(p for p in items if p["_id"] == pid)

    def test_seeded_drinks_keep_their_original_look(self, client):
        latte = self.get(client, "latte")
        assert (latte["cupColor"], latte["foam"], latte["smallCup"]) == ("#7C5838", "art", False)
        assert latte["category"] == "Milk"
        espresso = self.get(client, "espresso")
        assert (espresso["foam"], espresso["smallCup"]) == ("crema", True)

    def test_new_product_gets_the_same_fallback_the_app_picks(self, client):
        # frontend/data/menu.ts artFor() hashes the id to pick from FALLBACK_ART;
        # "thai-tea" lands on index 3 there (checked with node).
        r = client.post("/products", json={"name": "Thai Tea", "price": 55}, headers=ADMIN_HEADERS)
        body = r.get_json()
        assert (body["cupColor"], body["foam"], body["smallCup"]) == ("#5A3A22", "crema", False)

    def test_create_with_art(self, client):
        r = client.post(
            "/products",
            json={"name": "Matcha", "price": 60, "cupColor": "#4a7a3a", "foam": "dome", "smallCup": True},
            headers=ADMIN_HEADERS,
        )
        assert r.status_code == 201
        body = r.get_json()
        assert (body["cupColor"], body["foam"], body["smallCup"]) == ("#4A7A3A", "dome", True)

    def test_update_art(self, client):
        r = client.patch(
            "/products/latte", json={"cupColor": "#112233", "foam": "none"}, headers=ADMIN_HEADERS
        )
        assert r.status_code == 200
        assert (r.get_json()["cupColor"], r.get_json()["foam"]) == ("#112233", "none")

    def test_invalid_art_rejected(self, client):
        for bad in (
            {"cupColor": "red"},
            {"cupColor": "#12345"},
            {"cupColor": "#GGGGGG"},
            {"cupColor": 123},
            {"foam": "whipped"},
            {"foam": None},
            {"smallCup": "yes"},
        ):
            r = client.patch("/products/latte", json=bad, headers=ADMIN_HEADERS)
            assert r.status_code == 400, bad

    def test_backfill_fills_missing_art_only(self, client, app_module):
        app_module.products.delete_many({})
        app_module.products.insert_many(
            [
                # Seeded before cup art existed: gets its original look back.
                {"_id": "latte", "name": "Latte", "price": 50, "category": ""},
                # Admin-added before cup art existed: gets the app's fallback.
                {"_id": "old-drink", "name": "Old", "price": 45},
                # Already has art and a badge: left alone.
                {"_id": "mocca", "name": "Mocca", "price": 50, "category": "Sweet",
                 "cupColor": "#000000", "foam": "none", "smallCup": False},
            ]
        )
        app_module.backfill_cup_art()
        latte = self.get(client, "latte")
        assert (latte["cupColor"], latte["foam"], latte["category"]) == ("#7C5838", "art", "Milk")
        old = self.get(client, "old-drink")
        assert (old["cupColor"], old["foam"], old["smallCup"]) == ("#3A2216", "cocoa", False)
        mocca = self.get(client, "mocca")
        assert (mocca["cupColor"], mocca["category"]) == ("#000000", "Sweet")


# --------------------------------------------------------------------------- #
# Order routes
# --------------------------------------------------------------------------- #
SWEET_SEEDS = {"mocca", "espresso", "cappuccino", "latte"}


def order(client, product_id="mocca", temp="hot", **extra):
    """POST /bill for a product. Seeded sweet drinks default to 50%."""
    body = {"productId": product_id, "temp": temp, **extra}
    if "sweetness" not in body and product_id in SWEET_SEEDS:
        body["sweetness"] = 50
    return client.post("/bill", json=body)


class TestOrderRoutes:
    def test_bill_valid(self, client):
        r = order(client, "mocca", sweetness=75)
        assert r.status_code == 201
        body = r.get_json()
        assert body["name"] == "Mocca" and isinstance(body["_id"], int)
        assert body["productId"] == "mocca" and body["price"] == 50
        assert body["sweetness"] == 75
        assert "createdAt" in body  # orders are timestamped for history

    def test_client_cannot_set_price_or_name(self, client):
        r = order(client, "mocca", name="Free coffee", price=0)
        assert r.status_code == 201
        body = r.get_json()
        assert body["price"] == 50 and body["name"] == "Mocca"

    def test_price_follows_the_menu(self, client):
        client.patch("/products/latte", json={"price": 65}, headers=ADMIN_HEADERS)
        assert order(client, "latte").get_json()["price"] == 65

    def test_unknown_product_rejected(self, client):
        assert order(client, "no-such-drink").status_code == 400

    def test_hidden_product_rejected(self, client):
        client.patch("/products/latte", json={"available": False}, headers=ADMIN_HEADERS)
        assert order(client, "latte").status_code == 400

    def test_sweet_drink_needs_a_valid_level(self, client):
        assert client.post("/bill", json={"productId": "mocca", "temp": "hot"}).status_code == 400
        assert order(client, "mocca", sweetness=30).status_code == 400
        assert order(client, "mocca", sweetness=1000).status_code == 400

    def test_unsweetened_drink_takes_no_sweetness(self, client):
        assert order(client, "americano", sweetness=50).status_code == 400
        r = order(client, "americano", sweetness=None)
        assert r.status_code == 201 and r.get_json()["sweetness"] is None

    def test_product_with_bad_stored_price_not_sold_free(self, client, app_module):
        app_module.products.insert_many(
            [
                {"_id": "no-price", "name": "No Price", "hasSweetness": False},
                {"_id": "junk-price", "name": "Junk", "price": "abc", "hasSweetness": False},
                {"_id": "bool-price", "name": "Bool", "price": True, "hasSweetness": False},
                {"_id": "neg-price", "name": "Neg", "price": -5, "hasSweetness": False},
            ]
        )
        for pid in ("no-price", "junk-price", "bool-price", "neg-price"):
            r = order(client, pid)
            assert r.status_code == 400, pid
            assert "cannot be ordered" in r.get_json()["error"], pid

    def test_legacy_string_price_is_coerced(self, client, app_module):
        app_module.products.insert_one(
            {"_id": "old", "name": "Old", "price": "45", "hasSweetness": False}
        )
        r = order(client, "old")
        assert r.status_code == 201 and r.get_json()["price"] == 45

    def test_bill_bad_temp(self, client):
        assert order(client, "mocca", temp="warm").status_code == 400

    def test_bill_non_json(self, client):
        r = client.post("/bill", data="nope", content_type="text/plain")
        assert r.status_code == 400

    def test_order_ids_increment(self, client):
        first = order(client, "mocca").get_json()["_id"]
        second = order(client, "latte", temp="cold").get_json()["_id"]
        assert second == first + 1

    def test_coffee_requires_admin(self, client):
        # Order history is customer data — the legacy /coffee is no longer public.
        assert client.get("/coffee").status_code == 401
        order(client)
        r = client.get("/coffee", headers=ADMIN_HEADERS)
        assert r.status_code == 200 and len(r.get_json()) == 1


class TestOrderHistory:
    def test_orders_requires_admin(self, client):
        assert client.get("/orders").status_code == 401

    def test_orders_shape_and_summary(self, client):
        client.patch("/products/latte", json={"price": 60}, headers=ADMIN_HEADERS)
        order(client, "mocca")
        order(client, "latte", temp="cold")
        r = client.get("/orders", headers=ADMIN_HEADERS)
        assert r.status_code == 200
        body = r.get_json()
        assert body["summary"] == {"count": 2, "revenue": 110}
        assert len(body["orders"]) == 2

    def test_orders_newest_first(self, client):
        order(client, "mocca")
        order(client, "latte", temp="cold")
        orders = client.get("/orders", headers=ADMIN_HEADERS).get_json()["orders"]
        assert orders[0]["name"] == "Latte"  # most recent first

    def test_delete_order_requires_admin(self, client):
        oid = order(client).get_json()["_id"]
        assert client.delete(f"/orders/{oid}").status_code == 401
        assert client.delete(f"/orders/{oid}", headers=ADMIN_HEADERS).status_code == 200
        assert client.get("/orders", headers=ADMIN_HEADERS).get_json()["summary"]["count"] == 0

    def test_delete_order_missing(self, client):
        assert client.delete("/orders/9999", headers=ADMIN_HEADERS).status_code == 404

    def test_csv_export(self, client):
        order(client, "latte", sweetness=25)
        assert client.get("/orders.csv").status_code == 401
        r = client.get("/orders.csv", headers=ADMIN_HEADERS)
        assert r.status_code == 200
        assert "text/csv" in r.headers["Content-Type"]
        text = r.get_data(as_text=True)
        assert text.splitlines()[0] == "id,name,temp,sweetness,price,createdAt"
        assert "Latte" in text


# --------------------------------------------------------------------------- #
# Malformed input and legacy data must never produce a 500.
# --------------------------------------------------------------------------- #
class TestRobustness:
    def test_non_ascii_admin_token_is_rejected_not_crashed(self, client):
        # Header values decode as latin-1, so a high byte reaches compare_digest.
        for probe in ("café", "ÿ" * 20, "test-admin-tokené"):
            r = client.get("/products?all=1", headers={"X-Admin-Token": probe})
            assert r.status_code == 401, probe
            r = client.get("/orders", headers={"X-Admin-Token": probe})
            assert r.status_code == 401, probe

    def test_non_string_product_id_rejected(self, client):
        r = client.post(
            "/products",
            json={"name": "Tea", "price": 40, "id": 123},
            headers=ADMIN_HEADERS,
        )
        assert r.status_code == 400

    def test_blank_product_id_falls_back_to_name(self, client):
        r = client.post(
            "/products",
            json={"name": "Flat White", "price": 60, "id": ""},
            headers=ADMIN_HEADERS,
        )
        assert r.status_code == 201 and r.get_json()["_id"] == "flat-white"

    def test_malformed_order_id_is_404_not_500(self, client):
        for oid in ("--5", "1.5", "abc", "1e5", "٣"):
            assert client.delete(f"/orders/{oid}", headers=ADMIN_HEADERS).status_code == 404, oid

    def test_legacy_string_id_order_deletable(self, client, app_module):
        app_module.collection.insert_one({"_id": "legacy-abc", "name": "Old", "price": 50})
        assert client.delete("/orders/legacy-abc", headers=ADMIN_HEADERS).status_code == 200

    def test_legacy_non_numeric_price_does_not_break_history(self, client, app_module):
        app_module.collection.insert_many(
            [
                {"_id": "l1", "name": "Old", "price": "50"},   # string price
                {"_id": "l2", "name": "Older"},                # price missing
                {"_id": "l3", "name": "Oldest", "price": None},
            ]
        )
        order(client, "mocca")  # price 50
        r = client.get("/orders", headers=ADMIN_HEADERS)
        assert r.status_code == 200
        summary = r.get_json()["summary"]
        assert summary["count"] == 4
        assert summary["revenue"] == 100  # "50" coerced, missing/None treated as 0

    def test_legacy_non_numeric_price_does_not_break_csv(self, client, app_module):
        app_module.collection.insert_one({"_id": "l1", "name": "Old", "price": "50"})
        assert client.get("/orders.csv", headers=ADMIN_HEADERS).status_code == 200

    def test_csv_formula_injection_is_neutralised(self, client, app_module):
        app_module.collection.insert_one({"_id": 1, "name": "=1+1", "price": 10})
        row = client.get("/orders.csv", headers=ADMIN_HEADERS).get_data(
            as_text=True
        ).splitlines()[1]
        assert "'=1+1" in row
        assert not row.split(",")[1].startswith("=")

    def test_legacy_product_without_available_still_on_menu(self, client, app_module):
        # Docs written before the `available` flag existed must not vanish.
        app_module.products.insert_one(
            {"_id": "old-drink", "name": "Old Drink", "price": 45, "sortOrder": 5}
        )
        ids = [p["_id"] for p in client.get("/products").get_json()]
        assert "old-drink" in ids

    def test_explicitly_unavailable_product_still_hidden(self, client, app_module):
        app_module.products.insert_one(
            {"_id": "gone", "name": "Gone", "price": 45, "available": False}
        )
        ids = [p["_id"] for p in client.get("/products").get_json()]
        assert "gone" not in ids
