# GoCart Backend API Service 🛒⚡

Modern, scalable RESTful API service built for the GoCart Multi-Vendor E-Commerce platform using **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## 🏗️ Architecture & Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database:** PostgreSQL (v15+)
- **ORM:** Prisma ORM
- **Security & Utilities:** Helmet, CORS, Morgan, Dotenv
- **DevOps Support:** Multi-stage Dockerfile, Health Check Probes, Seed scripts

---

## 📁 Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema definitions & relations
│   └── seed.js              # Initial database seed script (users, products, stores, coupons)
├── src/
│   ├── config/
│   │   └── db.js            # Prisma client singleton
│   ├── controllers/         # Request handling & business logic
│   │   ├── adminController.js
│   │   ├── addressController.js
│   │   ├── authController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── ratingController.js
│   │   └── storeController.js
│   ├── middlewares/         # Global error handling and logging
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── routes/              # Modular REST API routes
│   │   ├── adminRoutes.js
│   │   ├── addressRoutes.js
│   │   ├── authRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── ratingRoutes.js
│   │   └── storeRoutes.js
│   └── server.js            # Server setup, CORS, health probes & graceful shutdown
├── .env.example             # Environment variable template
├── Dockerfile               # Container build file
└── package.json             # Scripts & dependencies
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://postgres:postgres@localhost:5432/gocart?schema=public` |
| `CORS_ORIGIN` | Allowed client origin | `http://localhost:3000` |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run db:generate
```

### 3. Apply Database Migrations / Push Schema
To push the schema to your running PostgreSQL instance:
```bash
npm run db:push
# or for formal migration history:
npm run db:migrate
```

### 4. Seed Database with Initial Data
Populate demo users, stores, products, coupons, and orders:
```bash
npm run db:seed
```

### 5. Launch Development Server
```bash
npm run dev
```

### 6. Explore Database in Browser (Prisma Studio)
```bash
npm run db:studio
```

---

## 📡 API Reference & Endpoints

### 🩺 Health & System
- `GET /api/health` - Health check (Returns PostgreSQL connectivity, memory, and uptime for Docker/K8s probes)
- `GET /` - API service info and sitemap

### 👤 Authentication & Users (`/api/auth`)
- `POST /api/auth/register` - Create or upsert user
- `POST /api/auth/login` - User login / profile retrieval
- `GET /api/auth/user/:id` - Get user profile with store and addresses
- `PUT /api/auth/user/:id/cart` - Sync user cart items
- `GET /api/auth/users` - List all users (admin)

### 📦 Products (`/api/products`)
- `GET /api/products` - List products with optional queries:
  - `?category=Speakers`
  - `?search=lamp`
  - `?sort=price_asc | price_desc | oldest`
  - `?storeId=...`
  - `?inStock=true`
- `GET /api/products/categories` - Get distinct categories
- `GET /api/products/:id` - Product details with store and ratings
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `PATCH /api/products/:id/stock` - Toggle in-stock availability
- `DELETE /api/products/:id` - Delete product

### 🏪 Stores & Vendors (`/api/stores`)
- `GET /api/stores` - List stores (`?status=approved` or `?status=pending`)
- `GET /api/stores/:id` - Store details by ID
- `GET /api/stores/username/:username` - Store details by username
- `GET /api/stores/user/:userId` - Store by user ID
- `POST /api/stores` - Apply to create a vendor store
- `PATCH /api/stores/:id/status` - Admin approve / reject store (`{ status: "approved" | "rejected" }`)
- `PATCH /api/stores/:id/active` - Toggle store active status
- `GET /api/stores/:id/dashboard` - Vendor dashboard metrics (products count, earnings, orders, reviews)

### 🛍️ Orders (`/api/orders`)
- `POST /api/orders` - Place new order (COD or Stripe)
- `GET /api/orders/user/:userId` - Order history for customer
- `GET /api/orders/store/:storeId` - Orders received by vendor store
- `GET /api/orders/:id` - Single order details with items
- `PATCH /api/orders/:id/status` - Update order status (`ORDER_PLACED`, `PROCESSING`, `SHIPPED`, `DELIVERED`)
- `PATCH /api/orders/:id/payment` - Update payment status

### 🎟️ Coupons (`/api/coupons`)
- `GET /api/coupons` - List all coupons
- `POST /api/coupons` - Create coupon
- `POST /api/coupons/validate` - Validate coupon code against user and cart
- `DELETE /api/coupons/:code` - Delete coupon

### 📍 Addresses (`/api/addresses`)
- `GET /api/addresses/user/:userId` - Get saved addresses for user
- `POST /api/addresses` - Add new delivery address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Remove address

### ⭐ Ratings & Reviews (`/api/ratings`)
- `GET /api/ratings/product/:productId` - Get ratings for a product
- `POST /api/ratings` - Add a review/rating

### 📊 Admin Analytics (`/api/admin`)
- `GET /api/admin/dashboard` - Platform-wide statistics (products, total stores, orders, revenue, sales timeline)
- `GET /api/admin/pending-stores` - List pending store approval requests
