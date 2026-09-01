# Smart Inventory & Stock Management System

## Overview
This project is a full-stack inventory and stock management platform built for a fruit and grocery storefront. It helps customers browse products, manage cart and wishlist items, place orders, and track purchases, while giving admins control over inventory, categories, customers, orders, coupons, and reporting.

## Features

### Customer
- Product browsing
- Categories
- Product details
- Search and filtering on the products page
- Cart management
- Wishlist management
- Checkout flow
- Order history and order details
- Authentication and profile management

### Admin
- Admin login
- Dashboard analytics
- Product management
- Category management
- Inventory and stock management
- Order management
- Customer management
- Coupon management
- Reports
- Contact message management

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-style component library
- Wouter for routing
- TanStack Query for data fetching
- Recharts for analytics charts

### Backend
- Node.js
- Express
- TypeScript
- JWT-based authentication
- Cookie-based session handling
- Pino logging

### Database
- PostgreSQL
- Drizzle ORM

### Tools
- pnpm workspaces
- Drizzle Kit
- TypeScript
- esbuild
- Render deployment hosting

## Architecture
The application follows a standard full-stack flow:

Frontend → Backend API → PostgreSQL Database

The React storefront communicates with the Express API, which reads and writes inventory, product, customer, order, and admin data in PostgreSQL using Drizzle ORM.

## Project Structure

```text
smart-inventory-stock-management-system/
├─ artifacts/
│  ├─ api-server/
│  │  ├─ src/
│  │  ├─ build.mjs
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  ├─ fruit-shop/
│  │  ├─ src/
│  │  ├─ public/
│  │  ├─ vite.config.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ mockup-sandbox/
├─ lib/
│  ├─ api-client-react/
│  ├─ api-spec/
│  └─ db/
├─ scripts/
├─ .env
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ tsconfig.json
├─ README.md
└─ replit.md
```

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Configure environment variables

Create a root `.env` file and set your PostgreSQL connection string and session secret. Example structure:

```env
DATABASE_URL=postgresql://user:password@host:5432/database_name
SESSION_SECRET=your-session-secret
PORT=8080
```

3. Set up the database

```bash
pnpm --dir lib/db push
```

Optional admin seed:

```bash
pnpm --dir scripts seed:admin
```

4. Run the application

Start the backend API:

```bash
pnpm --dir artifacts/api-server dev
```

Start the frontend app:

```bash
pnpm --dir artifacts/fruit-shop dev
```

## Deployment
This project is configured for Render deployment and the frontend currently points to the deployed API URL.

Production URL:https://ark-smart-inventory-frontend.onrender.com/

## Future Improvements
- Add real payment gateway integration
- Implement automated low-stock alerts and restock recommendations
- Add advanced reporting and export features
- Improve inventory analytics with forecasting
- Add multi-user role permissions and audit logs

## Author
Built as a full-stack portfolio project by a developer focused on practical e-commerce and inventory system design.
