"""Test setup: run the Flask app against an in-memory Mongo (mongomock).

We patch pymongo *before* importing the app and force test-only environment
values, so the suite never connects to the real Atlas cluster and never reads
the developer's .env secrets.
"""
import os

import mongomock
import pymongo
import pytest

# Force test config before backend imports and reads it.
os.environ["MONGO_URL"] = "mongodb://localhost:27017/test"
os.environ["MONGO_DB"] = "CoffeeShopTest"
os.environ["ADMIN_TOKEN"] = "test-admin-token"
os.environ["CORS_ORIGINS"] = "*"

# `from pymongo import MongoClient` in backend.py will now resolve to mongomock.
pymongo.MongoClient = mongomock.MongoClient

import backend  # noqa: E402  (must come after the patch above)

ADMIN_TOKEN = os.environ["ADMIN_TOKEN"]
ADMIN_HEADERS = {"X-Admin-Token": ADMIN_TOKEN}


@pytest.fixture(autouse=True)
def fresh_db():
    """Reset to a freshly seeded database before every test."""
    backend.products.delete_many({})
    backend.counters.delete_many({})
    backend.collection.delete_many({})
    backend.seed_products_if_empty()
    yield


@pytest.fixture
def client():
    backend.app.config.update(TESTING=True)
    return backend.app.test_client()


@pytest.fixture
def app_module():
    return backend
