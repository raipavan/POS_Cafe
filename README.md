# Cafe POS Suite

A full-stack cafe and restaurant POS starter built with React + Vite, Express.js, and PostgreSQL. Includes billing, counter/takeaway/dine-in order types, table management, kitchen tickets, configurable product tax rates, receipt print view, ingredients/recipes/stock movements, supplier purchase receiving, customer loyalty, expenses, reports, staff roles, settings, and audit logs.

> **Production note:** This is a runnable starter implementation, not certified accounting/tax software. Before live use, review GST invoice requirements with a qualified Indian tax professional; test payment/refund reconciliation, stock valuation, permissions, printer compatibility, backups, and restore procedures. Card/UPI payment gateway integration is not included: the app records a payment method and amount, it does not charge a payment instrument.

## Requirements
- Node.js 20+
- Docker Desktop (or a local PostgreSQL 15+ instance)

## Run locally

1. Start PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
2. Configure environment:
   ```bash
   cp .env.example server/.env
   ```
   Update `DATABASE_URL` and set `SESSION_SECRET` to a long random value.
3. Install dependencies and migrate:
   ```bash
   npm install
   npm run install:all
   npm run db:migrate
   ```
4. Start the app from the repository root:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173`. Use **First time? Create the initial owner account**. The bootstrap endpoint works only while the users table is empty. Use a password of at least 12 characters.

API health check: `http://localhost:4000/api/v1/health`.

## First-time setup
1. Create owner account.
2. In Menu Management, create categories through the API (the current UI can add products; category management UI is a follow-up enhancement), then add products and tax rates.
3. In Inventory, add ingredients and opening stock.
4. Configure recipes via `PUT /api/v1/inventory/recipes/:productId` with `{ "items": [{ "ingredient_id": "UUID", "quantity_required": 18 }] }`.
5. Add dining tables under Tables & Orders.
6. Add business invoice details in Settings & Audit.
7. Test with a small sample order and print a receipt before live use.

## API summary
All protected endpoints use `Authorization: Bearer <token>`.
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/bootstrap-owner` (one-time, only if no users exist)
- `GET/POST/PATCH /api/v1/products`
- `GET/POST /api/v1/categories`
- `GET/POST /api/v1/tables`
- `POST /api/v1/orders`, `POST /api/v1/orders/:id/checkout`, `POST /api/v1/orders/:id/refunds`
- `GET /api/v1/kitchen/tickets`, `PATCH /api/v1/kitchen/tickets/:id/items/:itemId`
- `GET/POST /api/v1/inventory/ingredients`, `PUT /api/v1/inventory/recipes/:productId`, `POST /api/v1/inventory/adjustments`
- `POST /api/v1/purchases`, `POST /api/v1/purchases/:id/receive`
- `GET/POST /api/v1/customers`, `GET /api/v1/customers/:id/loyalty`
- `GET/POST /api/v1/expenses`
- `GET /api/v1/reports/sales`, `/products`, `/payments`, `/tax`, `/expenses`, `/profit`
- `GET/POST /api/v1/users`, `GET/PUT /api/v1/settings`, `GET /api/v1/audit-logs`

## Important implementation boundaries
- Product price/tax is read from the database when an order is created. Orders preserve price/tax snapshots.
- Recipe stock is deducted when the order is placed. Add explicit stock reversal handling before enabling order cancellation/refunds in production.
- GST split display (CGST/SGST/IGST), credit notes, e-invoice/e-way bill integrations, printer drivers, payment gateway callbacks, and robust stock costing by historical period need validation/extension for the business's actual requirements.
- Profit report is an estimate based on stock movements and current ingredient average costs; it is not a substitute for an accounting ledger.
- The starter uses bearer JWT tokens stored in browser localStorage for simplicity. For production, consider secure HTTP-only cookies, CSRF protections, HTTPS, session revocation, and security review.
