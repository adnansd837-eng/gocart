<div align="center">
  <h1>🛒 GoCart - Multi-Vendor E-Commerce Platform</h1>
  <p>
    Full-stack, multi-tier architecture with Next.js Frontend, Node.js/Express Backend, and PostgreSQL Database via Prisma ORM.
  </p>
</div>

---

## 🏛️ System Architecture

```
gocart/
├── frontend/                     # Next.js 15 Client Application
│   ├── app/                      # Next.js App Router (Public, Vendor, Admin)
│   ├── components/               # UI Components
│   ├── lib/                      # Redux Store & Slices
│   ├── assets/                   # Static Media & Icons
│   ├── Dockerfile                # Frontend Containerfile
│   └── package.json
│
├── backend/                      # Node.js + Express REST API Service
│   ├── prisma/
│   │   ├── schema.prisma         # PostgreSQL Prisma Schema
│   │   └── seed.js               # Database Seeding Script
│   ├── src/
│   │   ├── config/               # Database Singleton Connection
│   │   ├── controllers/          # Business Logic & CRUD Handlers
│   │   ├── middlewares/          # Logger & Global Error Handlers
│   │   ├── routes/               # Modular REST Endpoints
│   │   └── server.js             # Express Server & Probes
│   ├── Dockerfile                # Backend Containerfile
│   ├── README.md                 # Detailed API Documentation
│   └── package.json
│
├── docker-compose.yml            # Complete Orchestration (Frontend + Backend + PostgreSQL)
├── .env.example                  # Environment Template
└── README.md                     # Root Documentation
```

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, React 19, Tailwind CSS | Responsive storefront, seller portal, and admin dashboard |
| **Backend** | Node.js, Express.js, Helmet, CORS | RESTful API service with structured error handling & logging |
| **Database** | PostgreSQL 16, Prisma ORM | Relational database with automated migrations & seeding |
| **DevOps** | Docker, Docker Compose | Multi-container orchestration with health checks and volume persistence |

---

## 🚀 DevOps Hands-On: Quick Start with Docker Compose

Ensure Docker and Docker Compose are installed and running.

### 1. Start All Services
```bash
docker compose up --build -d
```

This launches:
1. `gocart-postgres` on port `5432` with automated health checks (`pg_isready`)
2. `gocart-backend` on port `5000` (starts once PostgreSQL is healthy)
3. `gocart-frontend` on port `3000`

### 2. Run Database Migrations & Seed Initial Data
```bash
# Push schema to PostgreSQL container:
docker compose exec backend npm run db:push

# Seed demo users, products, stores, coupons, and orders:
docker compose exec backend npm run db:seed
```

### 3. Verify Health Probes
```bash
# Check backend and database connectivity:
curl http://localhost:5000/api/health
```

### 4. Stop Services
```bash
docker compose down
# Or to clear persistent database volume:
docker compose down -v
```

---

## 💻 Local Development (Without Docker)

### Prerequisites
- Node.js (v20+)
- PostgreSQL server running locally on port `5432` with a database named `gocart`

### 1. Setup Backend & PostgreSQL
```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client
npm run db:generate

# Push schema to PostgreSQL
npm run db:push

# Seed initial data
npm run db:seed

# Start backend dev server
npm run dev
```
Backend will be live at `http://localhost:5000`.

### 2. Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Frontend will be live at `http://localhost:3000`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and PostgreSQL connection ping |
| `POST` | `/api/auth/register` | Register / sync user profile |
| `GET` | `/api/products` | Query products by category, keyword, stock, price sort |
| `POST` | `/api/products` | Create a new vendor product |
| `GET` | `/api/stores` | List stores (approved or pending review) |
| `POST` | `/api/stores` | Register a new seller store |
| `PATCH` | `/api/stores/:id/status` | Admin approve or reject seller store |
| `POST` | `/api/orders` | Place order with items and delivery address |
| `GET` | `/api/orders/user/:userId` | Customer order history |
| `GET` | `/api/orders/store/:storeId`| Vendor orders received |
| `POST` | `/api/coupons/validate` | Verify coupon validity and discounts |
| `GET` | `/api/admin/dashboard` | Platform metrics (revenue, stores, orders, products) |

*For complete API parameters and payload structures, see [`backend/README.md`](./backend/README.md).*

---

## 📜 License
MIT License.
