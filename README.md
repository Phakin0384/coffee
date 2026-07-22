# CREMA — Coffee Machine Kiosk

A touchscreen coffee-ordering app for a self-service coffee machine, with a
Flask + MongoDB backend and a browser-based admin for managing the menu.

- **Kiosk app** — Expo / React Native (also runs on the web for a Chromium kiosk panel).
  Flow: **Home → Menu → Customize (sweetness + temperature) → Payment (QR) → Thank you**.
- **Backend** — Flask API storing orders and products in MongoDB.
- **Admin** — a web dashboard (served by the backend) to add / edit / hide / delete drinks.

## Repository layout

```
App.js                 Navigation (Home, Menu, Buy, Payment)
frontend/
  home.js, menu.js     Home + menu screens
  screens/             BuyScreen, PaymentScreen (one each, data-driven)
  api/                 config.ts (base URL), client.ts (axios + calls)
  data/                menu.ts (offline fallback), product.ts (pure mappers)
  types.ts             Shared TypeScript types
  theme.ts             Colors / radius
  __tests__/           Jest unit tests
backend/
  backend.py           Flask app: orders + products CRUD + admin auth
  static/admin.html    Product admin dashboard (served at /admin)
  tests/               Pytest suite (runs against an in-memory Mongo)
design/
  kiosk-concept.html   Interactive kiosk UI design concept
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- A MongoDB database (e.g. MongoDB Atlas)

## Backend setup

```bash
cd backend
python -m venv .venv && . .venv/Scripts/activate   # Windows; use bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env          # then edit .env (see below)
python backend.py             # serves on http://localhost:5000
```

### Environment (`backend/.env`)

| Variable          | Purpose                                                        |
| ----------------- | ------------------------------------------------------------- |
| `MONGO_URL`       | MongoDB connection string (**never commit this**)             |
| `MONGO_DB`        | Database name (default `CoffeeShop`)                          |
| `MONGO_COLLECTION`| Orders collection (default `coffee`)                         |
| `ADMIN_TOKEN`     | Passcode for the admin dashboard / product write endpoints    |
| `CORS_ORIGINS`    | Comma-separated allowed origins, or `*`                       |
| `FLASK_DEBUG`     | `true` only in local development                              |
| `PORT`            | Port (default `5000`)                                         |

`.env` is git-ignored. On first run the `products` collection is seeded with
the default five drinks.

## App setup

```bash
npm install
npm start            # Expo dev server; press w for web, or scan the QR on a device
```

In development the app auto-discovers the backend on your machine's LAN IP at
port 5000. For production set `expo.extra.apiUrl` in `app.json` to your API URL.

## Admin dashboard

Open **http://localhost:5000/admin**, enter the `ADMIN_TOKEN`, and add / edit /
hide / delete drinks. Changes appear on the kiosk the next time it loads the
menu. Hidden (unavailable) drinks stay off the kiosk but remain in the admin.

## API

| Method   | Route             | Auth        | Description                          |
| -------- | ----------------- | ----------- | ------------------------------------ |
| `GET`    | `/products`       | public      | Available menu items (for the kiosk) |
| `GET`    | `/products?all=1` | admin token | All items, including hidden          |
| `POST`   | `/products`       | admin token | Create a product                     |
| `PUT`    | `/products/<id>`  | admin token | Update a product                     |
| `DELETE` | `/products/<id>`  | admin token | Delete a product                     |
| `POST`   | `/bill`           | public      | Record an order                      |
| `GET`    | `/coffee`         | public      | List recorded orders                 |

Admin requests send the passcode in the `X-Admin-Token` header. If `ADMIN_TOKEN`
is unset, all write endpoints are refused.

## Scripts

```bash
npm run lint          # ESLint
npm run format        # Prettier (write)
npm run typecheck     # tsc --noEmit
npm test              # Jest (frontend unit tests)

cd backend && pytest  # backend tests (in-memory Mongo, no Atlas needed)
```

## Notes / roadmap

- The admin uses a single shared passcode. For production, move to per-user
  accounts with hashed passwords + sessions, serve over HTTPS, and rate-limit
  the admin routes.
- TypeScript adoption is gradual: the non-UI core (`types`, `data`, `api`,
  `theme`) is typed; screens are still `.js` under `allowJs` and can be migrated
  to `.tsx` incrementally.
