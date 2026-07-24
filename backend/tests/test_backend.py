"""Tests for the coffee backend: validation helpers and HTTP routes."""
from conftest import ADMIN_HEADERS


# --------------------------------------------------------------------------- #
# Validation helpers (pure functions)
# --------------------------------------------------------------------------- #
class TestOrderValidation:
    def test_valid_order(self, app_module):
        cleaned, err = app_module._validate_order(
            {"name": "Mocca", "price": 50, "temp": "hot", "sweetness": 75}
        )
        assert err is None
        assert cleaned == {"name": "Mocca", "price": 50, "temp": "hot", "sweetness": 75}

    def test_sweetness_optional(self, app_module):
        cleaned, err = app_module._validate_order(
            {"name": "Americano", "price": 50, "temp": "cold"}
        )
        assert err is None
        assert cleaned["sweetness"] is None

    def test_temp_normalized_and_checked(self, app_module):
        cleaned, err = app_module._validate_order(
            {"name": "Latte", "price": 50, "temp": "HOT"}
        )
        assert err is None and cleaned["temp"] == "hot"

        _, err = app_module._validate_order(
            {"name": "Latte", "price": 50, "temp": "warm"}
        )
        assert err is not None

    def test_missing_field(self, app_module):
        _, err = app_module._validate_order({"name": "X", "temp": "hot"})
        assert "price" in err

    def test_negative_price(self, app_module):
        _, err = app_module._validate_order({"name": "X", "price": -1, "temp": "hot"})
        assert err is not None

    def test_bad_sweetness_type(self, app_module):
        _, err = app_module._validate_order(
            {"name": "X", "price": 50, "temp": "hot", "sweetness": "lots"}
        )
        assert err is not None

    def test_bool_not_accepted_as_number(self, app_module):
        _, err = app_module._validate_order(
            {"name": "X", "price": True, "temp": "hot"}
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
# Order routes
# --------------------------------------------------------------------------- #
class TestOrderRoutes:
    def test_bill_valid(self, client):
        r = client.post(
            "/bill", json={"name": "Mocca", "price": 50, "temp": "hot", "sweetness": 75}
        )
        assert r.status_code == 201
        body = r.get_json()
        assert body["name"] == "Mocca" and isinstance(body["_id"], int)
        assert "createdAt" in body  # orders are timestamped for history

    def test_bill_bad_temp(self, client):
        r = client.post("/bill", json={"name": "Mocca", "price": 50, "temp": "warm"})
        assert r.status_code == 400

    def test_bill_non_json(self, client):
        r = client.post("/bill", data="nope", content_type="text/plain")
        assert r.status_code == 400

    def test_order_ids_increment(self, client):
        first = client.post(
            "/bill", json={"name": "A", "price": 50, "temp": "hot"}
        ).get_json()["_id"]
        second = client.post(
            "/bill", json={"name": "B", "price": 50, "temp": "cold"}
        ).get_json()["_id"]
        assert second == first + 1

    def test_coffee_requires_admin(self, client):
        # Order history is customer data — the legacy /coffee is no longer public.
        assert client.get("/coffee").status_code == 401
        client.post("/bill", json={"name": "A", "price": 50, "temp": "hot"})
        r = client.get("/coffee", headers=ADMIN_HEADERS)
        assert r.status_code == 200 and len(r.get_json()) == 1


class TestOrderHistory:
    def test_orders_requires_admin(self, client):
        assert client.get("/orders").status_code == 401

    def test_orders_shape_and_summary(self, client):
        client.post("/bill", json={"name": "A", "price": 50, "temp": "hot"})
        client.post("/bill", json={"name": "B", "price": 60, "temp": "cold"})
        r = client.get("/orders", headers=ADMIN_HEADERS)
        assert r.status_code == 200
        body = r.get_json()
        assert body["summary"] == {"count": 2, "revenue": 110}
        assert len(body["orders"]) == 2

    def test_orders_newest_first(self, client):
        client.post("/bill", json={"name": "First", "price": 50, "temp": "hot"})
        client.post("/bill", json={"name": "Second", "price": 50, "temp": "cold"})
        orders = client.get("/orders", headers=ADMIN_HEADERS).get_json()["orders"]
        assert orders[0]["name"] == "Second"  # most recent first

    def test_delete_order_requires_admin(self, client):
        oid = client.post(
            "/bill", json={"name": "A", "price": 50, "temp": "hot"}
        ).get_json()["_id"]
        assert client.delete(f"/orders/{oid}").status_code == 401
        assert client.delete(f"/orders/{oid}", headers=ADMIN_HEADERS).status_code == 200
        assert client.get("/orders", headers=ADMIN_HEADERS).get_json()["summary"]["count"] == 0

    def test_delete_order_missing(self, client):
        assert client.delete("/orders/9999", headers=ADMIN_HEADERS).status_code == 404

    def test_csv_export(self, client):
        client.post("/bill", json={"name": "Latte", "price": 55, "temp": "hot", "sweetness": 25})
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
        client.post("/bill", json={"name": "New", "price": 10, "temp": "hot"})
        r = client.get("/orders", headers=ADMIN_HEADERS)
        assert r.status_code == 200
        summary = r.get_json()["summary"]
        assert summary["count"] == 4
        assert summary["revenue"] == 60  # "50" coerced, missing/None treated as 0

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
