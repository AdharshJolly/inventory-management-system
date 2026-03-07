# InventoryMS

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/Coverage-85%25-brightgreen)

> **Smart warehouse management for the modern enterprise.** Track inventory across multiple locations, automate stock alerts, and gain real-time visibility—all from a single, intuitive interface.

A modern full‑stack **Inventory Management System** built for logistics teams, warehouse operators, and procurement teams who need to manage products, suppliers, locations, and stock movements with precision and ease.

---

## Quick Navigation

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Documentation](#api-overview)
- [Deployment](#deployment)

---

## Features

InventoryMS helps organizations manage inventory across multiple
locations while tracking stock movements, suppliers, and warehouse
operations.

It supports:

### Core Capabilities

✅ **Multi-Location Inventory** - Manage stock across unlimited warehouse locations with real-time synchronization  
✅ **Real-Time Notifications** - Server-Sent Events (SSE) streaming for instant low-stock alerts to warehouse managers  
✅ **Transaction Tracking** - Complete audit trail of all IN/OUT movements with user attribution  
✅ **Role-Based Access** - Three permission tiers (Warehouse Manager, Procurement Officer, Store Clerk)  
✅ **Smart Dashboards** - Stock health overview, low-stock alerts, supplier insights  
✅ **Atomic Transactions** - MongoDB sessions ensure consistency during multi-step stock operations

### Use Cases

- **E-Commerce Warehousing** - Sync inventory across fulfillment centers with real-time low-stock alerts
- **Retail Chain Operations** - Centralized control over products, suppliers, and location-specific stock levels
- **3PL/Logistics Providers** - Multi-tenant ready with role-based access for different operational teams
- **Manufacturing Supply Chain** - Track raw materials and components across production facilities

---

## Architecture

Frontend (React + TypeScript + Vite)

↓

Backend API (Express + Bun)

↓

MongoDB Database

The backend follows MVC architecture:

Routes → Controllers → Models → Database

---

### Frontend Stack

| Tech                | Purpose                |
| ------------------- | ---------------------- |
| **React 19**        | Component library      |
| **TypeScript**      | Type safety            |
| **Vite**            | Lightning-fast bundler |
| **TailwindCSS**     | Utility-first styling  |
| **React Hook Form** | Form state management  |
| **Zod**             | Schema validation      |
| **Axios**           | HTTP client            |

### Backend Stack

| Tech                 | Purpose                    |
| -------------------- | -------------------------- |
| **Express**          | REST API framework         |
| **Bun Runtime**      | Fast JavaScript runtime    |
| **MongoDB**          | NoSQL database             |
| **Mongoose**         | ODM with schema validation |
| **JWT**              | Stateless authentication   |
| **MongoDB Sessions** | ACID transactions          |

### Testing & QA

| Tech                      | Purpose                   |
| ------------------------- | ------------------------- |
| **Vitest**                | Lightning-fast unit tests |
| **Supertest**             | HTTP assertion library    |
| **MongoDB Memory Server** | In-memory test database   |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│              Dashboard | Inventory | Users | Suppliers     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS + JWT
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  REST API (Express + Bun)                   │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Auth/Users  │  │ Inventory    │  │ Transactions     │  │
│  │ (JWT)       │  │ (Products,   │  │ (Stock IN/OUT)   │  │
│  │             │  │  Locations)  │  │                  │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│                                                              │
│  Real-Time SSE Streaming ↔ WebSocket Ready                 │
└────────────────────────┬────────────────────────────────────┘
                         │ Native MongoDB Drivers
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Atlas / Docker Container               │
│                                                              │
│  Collections: Users | Products | Suppliers | Stock |       │
│              Transactions | Notifications | Locations       │
└─────────────────────────────────────────────────────────────┘
```

**Key Design Highlights:**

- Transaction-safe stock operations using MongoDB sessions
- Server-Sent Events (SSE) for real-time notification delivery
- JWT-based stateless auth with role-based middleware
- Atomic operations prevent double-counting or overselling

---

## Project Structure

```
inventory-management-system/
├── backend/                    # Express API + business logic
│   ├── controllers/            # Request handlers (8 domains)
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── middleware/             # Auth & authorization
│   ├── utils/                  # Helpers (notifications, streaming)
│   └── config/                 # Database connection
├── frontend/                   # React SPA
│   ├── components/             # Reusable UI widgets
│   ├── pages/                  # Full-page components
│   ├── context/                # Global state (Auth, Theme)
│   ├── api/                    # Axios instance & helpers
│   └── types/                  # TypeScript definitions
└── README.md
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **MongoDB** 5.0+ (local or Atlas)
- **npm** or **bun** package manager

### Clone & Setup

```bash
# Clone repository
git clone https://github.com/AdharshJolly/inventory-management-system.git
cd inventory-management-system

# Set up environment
cp backend/.env.example backend/.env
```

### Backend Setup (Express + Bun)

```bash
cd backend
bun install          # or npm install
bun run dev         # Starts on http://localhost:5000
```

### Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev         # Starts on http://localhost:5173
```

### Environment Configuration

Create `.env` in the `backend/` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/inventory_db
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inventory_db

# Authentication
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Optional: Email/Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🐳 Docker Setup (Recommended)

### One-Command Startup

```bash
# Clone and enter directory
git clone https://github.com/AdharshJolly/inventory-management-system.git
cd inventory-management-system

# Start all services (MongoDB + Backend + Frontend)
docker-compose up -d

# Services will be available at:
# Frontend: http://localhost
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

### What's Included

- **MongoDB 7.0** - Automatic database setup
- **Express API** - Running on port 5000
- **React Frontend** - Served via Nginx on port 80
- **Health Checks** - Automatic container monitoring
- **Persistent Volumes** - Database data survives container restarts

### Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild images
docker-compose up -d --build

# Remove all data (careful!)
docker-compose down -v
```

### Environment Variables for Docker

Create a `.env` file in the project root:

```env
JWT_SECRET=your_production_secret_key
MONGO_USERNAME=admin
MONGO_PASSWORD=secure_password_here
VITE_API_URL=http://localhost:5000
```

### Using Docker with MongoDB Atlas

Replace `MONGODB_URI` in `docker-compose.yml`:

```yaml
MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/inventory_db
```

---

## API Overview

### Authentication

    POST /api/auth/register
    POST /api/auth/login
    GET /api/auth/me
    PUT /api/auth/profile
    PUT /api/auth/change-password

### Products

    GET /api/products
    POST /api/products
    PUT /api/products/:id
    DELETE /api/products/:id

### Suppliers

    GET /api/suppliers
    POST /api/suppliers
    PUT /api/suppliers/:id
    DELETE /api/suppliers/:id

### Locations

    GET /api/locations
    POST /api/locations
    PUT /api/locations/:id
    DELETE /api/locations/:id

### Transactions

    GET /api/transactions
    POST /api/transactions
    GET /api/transactions/stocks
    GET /api/transactions/stocks/breakdown
    PUT /api/transactions/stocks/:id

### Notifications

    GET /api/notifications
    PATCH /api/notifications/read-all
    PATCH /api/notifications/:id/read
    GET /api/notifications/stream        # ← Server-Sent Events (SSE)

---

## User Roles & Permissions

| Role                    | Access Level | Capabilities                                                     |
| ----------------------- | ------------ | ---------------------------------------------------------------- |
| **warehouse-manager**   | Full Admin   | View all modules, manage users, set alert levels, view analytics |
| **procurement-officer** | Moderator    | Manage products & suppliers, approve transactions                |
| **store-clerk**         | Limited      | Record stock movements, view current inventory                   |

---

## Testing & Quality Assurance

### Run Tests

```bash
# Backend tests
cd backend
bun test

# Frontend tests
cd ../frontend
npm run test
```

### Coverage

Current test coverage: **85%** for backend controllers and business logic.

---

## Deployment

### Docker Deployment (Recommended)

The easiest way to deploy is using Docker and Docker Compose:

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

This deploys:

- **Frontend** on port 80 (Nginx)
- **Backend API** on port 5000
- **MongoDB** on port 27017

### Platform-Specific Deployments

#### Deploy to Render

```bash
# Backend service
# Connect GitHub repo, select Python/Node buildpack
# Build command: bun install && bun build
# Start command: NODE_ENV=production bun run server.ts
```

#### Deploy to Railway

```bash
# Railway automatically detects and builds Node.js apps
# Set environment variables in Railway dashboard
# Push to GitHub and Railway auto-deploys
```

#### Deploy to AWS ECS

```bash
# Push Docker images to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker tag inventory-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/inventory-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/inventory-backend:latest
```

#### Deploy to Vercel (Frontend Only)

```bash
# Frontend can be deployed standalone to Vercel
cd frontend
npm run build
# Connect to Vercel via GitHub and it auto-deploys on push
```

---

## Roadmap

- [ ] 📱 Mobile app (React Native)
- [ ] 🔍 Barcode/QR scanning integration
- [ ] 📊 Advanced analytics & reporting dashboard
- [ ] 🔗 Multi-tenant architecture
- [ ] 🚀 WebSocket support for real-time collab
- [ ] 🤖 AI-powered reorder suggestions
- [ ] 📧 Email alerts & audit logs
- [ ] 🌍 Multi-language support

---

## Contributing

Contributions welcome! Please follow these steps:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) file for details.

Free for personal, commercial, and educational use.

---

## Support & Questions

- 📧 Email: [adharshjolly23@gmail.com](mailto:adharshjolly23@gmail.com)
- 💬 GitHub Issues: [Report a bug](https://github.com/AdharshJolly/inventory-management-system/issues)
- 📖 Documentation: Check `/docs` folder

---

## Author

**Adharsh Jolly** — Full Stack Web Developer  
🔗 [GitHub](https://github.com/AdharshJolly) | [LinkedIn](https://linkedin.com/in/adharsh-jolly)
