# Fruit & Dry Fruits Shop Management System

A full-stack e-commerce web application for a premium fruit and dry fruits shop, featuring a beautiful customer storefront and a complete admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/fruit-shop run dev` — run the frontend (auto-assigned port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `SESSION_SECRET`

## Default Credentials (dev seed data)

- **Admin login:** admin@fruitshop.com / password123 → /admin/login
- **Customer login:** priya@example.com / password123 → /login

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion + Recharts
- Backend: Express 5 + PostgreSQL + Drizzle ORM
- Auth: JWT (jsonwebtoken + bcryptjs), stored in localStorage
- API codegen: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for API contracts
- `lib/db/src/schema/` — Drizzle ORM table definitions (users, categories, products, cart, wishlist, orders, reviews, coupons, contact)
- `artifacts/api-server/src/routes/` — Express route handlers (auth, categories, products, cart, wishlist, orders, reviews, coupons, contact, admin)
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify helpers
- `artifacts/api-server/src/middlewares/authenticate.ts` — authenticate, requireAdmin, optionalAuth middleware
- `artifacts/fruit-shop/src/` — React frontend
  - `hooks/use-auth.tsx` — AuthProvider + useAuth (React context, localStorage backed)
  - `pages/customer/` — storefront pages (home, products, product-detail, cart, wishlist, checkout, orders, profile, about, contact, faq, categories)
  - `pages/admin/` — admin pages (dashboard, products, orders, categories, customers, inventory, coupons, messages, reports)
  - `pages/auth/` — login, register

## Architecture decisions

- JWT auth stored in localStorage (fruit_shop_token + fruit_shop_user); custom-fetch.ts injects Authorization header automatically
- Auth context uses React context + useState (not zustand) to avoid duplicate React instance errors
- Products endpoint /products/featured and /products/bestsellers use fixed paths before /:id to avoid param collision in Express
- bcryptjs used for password hashing; admin and customer login are separate endpoints (/admin/login vs /auth/login)
- Cart is rebuilt fresh from DB on every mutation (buildCart function) to ensure consistency

## Product

- Customer: Browse products, filter/search, view product details, add to cart/wishlist, checkout, track orders, write reviews, contact
- Admin: Dashboard with stats+charts, manage products/categories/orders/customers/inventory/coupons/messages

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After spec changes, always run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Do NOT use `format: email` in openapi.yaml — Orval generates `zod.email()` which doesn't exist in this Zod version
- Express 5 wildcard routes use `/{*splat}` syntax not bare `*`
- `req.params.id` is `string | string[]` — always parse with `parseInt(Array.isArray(...) ? ...[0] : ..., 10)`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
