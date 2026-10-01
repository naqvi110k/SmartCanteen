# 🍔 Smart Canteen — Pre-Order & Queue Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-brightgreen?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-blue?style=flat-square&logo=socket.io)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

An AI-assisted, real-time smart canteen platform that eliminates physical queues, handles surge loads with 15-minute slot management, generates contactless single-use digital tokens (`C-023`) and QR codes, provides live kitchen queue displays, and equips canteen managers with 7 AI prediction engines.

---

## 📑 Table of Contents
- [✨ Key Capabilities](#-key-capabilities)
- [🏗️ System Architecture](#-system-architecture)
- [📦 Technology Stack](#-technology-stack)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [⚙️ Environment Configuration](#-environment-configuration)
- [📡 API Reference](#-api-reference)
- [🤖 AI & Predictive Intelligence](#-ai--predictive-intelligence)
- [👥 Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [📁 Folder Structure](#-folder-structure)

---

## ✨ Key Capabilities

- **⚡ Atomic Stock & Slot Capacity Management**: Prevents overselling during high-concurrency rush hours using atomic database increments/decrements.
- **🛡️ Idempotency & Double-Click Protection**: Enforces unique transaction keys to prevent duplicate order placements.
- **🔄 Strict Finite State Machine**: Governs status transitions (`Placed` ➔ `Accepted` ➔ `Preparing` ➔ `Ready` ➔ `Collected` / `Not Collected` ➔ `Completed`) with 409 conflict checks.
- **🎟️ Single-Use Digital Token & QR Handover**: Verifies token/QR at the collection counter with strict double-collection prevention.
- **⏱️ Smart Dynamic ETA & Kitchen Prioritization**: Real-time queue scoring:
  $$\text{ETA} = \text{Now} + \frac{\text{Queued Work}}{\text{Active Cooks}} + \text{Item Prep Time}$$
- **🔔 Live WebSockets (Socket.io)**: Push alerts to customer order trackers and kitchen display systems (KDS) instantly.
- **📊 Real-Time Analytics & Management KPIs**: Live revenue, prep velocity, bottleneck tracking, and slot utilization.
- **🧠 7-in-1 AI Predictive Engine**: Demand forecasting, peak congestion alerts, waste risk monitoring, and automated sales insights.

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------------------+
|                  Client Interface (Next.js 16 + React 19)               |
|      Customer Web App  |  Kitchen Display (KDS)  |  Admin / Manager     |
+-------------------------------------------------------------------------+
                                     │
                    HTTP / REST API  │  WebSockets (Socket.io)
                                     ▼
+-------------------------------------------------------------------------+
|                      Node.js + Express 5 Backend                        |
|  ├── JWT Auth & Role Middleware (Customer, Staff, Manager, Admin)       |
|  ├── Slot & Capacity Validator (15-min pickup windows)                 |
|  ├── Kitchen Queue Priority Engine & Live Sorter                        |
|  ├── Collection & Verification (QR Base64 / Digital Token)              |
|  ├── 7-Engine AI Predictive Intelligence Service                        |
|  └── Background Recurring Monitor (Delays, Expirations, Alerts)         |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                           MongoDB Database                              |
|   Users  •  MenuItems  •  Orders  •  Settings  •  SystemLogs  •  Alerts|
+-------------------------------------------------------------------------+
```

---

## 📦 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TailwindCSS v4, Lucide Icons |
| **Backend** | Node.js, Express 5, Socket.io, Helmet, Morgan, CORS, Express-Rate-Limit |
| **Database** | MongoDB with Mongoose 9 ODM |
| **Validation & Auth** | Zod, JSON Web Tokens (JWT), BCrypt.js |
| **Utilities** | QRCode, Nodemon |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB instance running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/naqvi110k/SmartCanteen.git
cd SmartCanteen

# Install project dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root folder (or use the pre-configured `.env`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_canteen
JWT_SECRET=smart_canteen_super_secret_jwt_key_2026
NODE_ENV=development
CLIENT_ORIGIN=*
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Start the Application

Open two terminal windows:

#### Terminal 1 — Start Backend Server (Port 5000)
```powershell
npm run backend:dev
```

#### Terminal 2 — Start Frontend Next.js App (Port 3000)
```powershell
npm run dev
```

### 4. Access URLs
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer/staff account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |

### 🍔 Menu Management (`/api/menu`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/menu` | Search, filter by category & list active items | Public |
| `GET` | `/api/menu/:id` | Get specific menu item details | Public |
| `PATCH` | `/api/menu/:id/availability` | Toggle item availability (`Available` / `Sold Out`) | Staff+ |
| `POST` | `/api/menu` | Create a new menu item | Manager, Admin |
| `PUT` | `/api/menu/:id` | Update menu item details & price | Manager, Admin |
| `DELETE` | `/api/menu/:id` | Soft delete menu item | Manager, Admin |

### 🛍️ Pre-Orders & Queue (`/api/orders`, `/api/queue`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/orders/pickup-slots` | Fetch 15-minute slot availability & capacities | Public |
| `POST` | `/api/orders` | Place pre-order (with stock decrement & token generation) | Customer |
| `GET` | `/api/orders` | View user order history | Customer |
| `GET` | `/api/orders/:id` | View full order status, digital token & QR | Authenticated |
| `POST` | `/api/orders/:id/cancel` | Cancel order before preparation starts | Customer |
| `GET` | `/api/queue/live` | Live kitchen display queue ordered by priority | Staff+ |
| `PATCH` | `/api/queue/:id/status` | Update kitchen status (`Accepted`, `Preparing`, `Ready`) | Staff+ |
| `PATCH` | `/api/queue/:id/delayed` | Flag order delay with custom reason | Staff+ |

### 🎟️ Collection Counter (`/api/collection`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/collection/verify` | Verify token or scan QR code | Staff+ |
| `POST` | `/api/collection/confirm` | Confirm pickup & transition order to `Completed` | Staff+ |

### 📊 Analytics & Reporting (`/api/analytics`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | Real-time KPIs (Revenue, Queue Load, Average ETA) | Manager, Admin |
| `GET` | `/api/analytics/reports` | Sales breakdowns by item, day, and slot metrics | Manager, Admin |

### 🤖 AI Services (`/api/ai`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/ai/demand-prediction` | Predict hourly food demand volume | Manager, Admin |
| `GET` | `/api/ai/peak-time-prediction` | Estimate upcoming congestion & rush hours | Manager, Admin |
| `GET` | `/api/ai/prep-forecasting` | High-velocity batch prep recommendations | Staff+ |
| `GET` | `/api/ai/recommendations` | Personalized customer recommendations | Customer |
| `GET` | `/api/ai/waste-prediction` | Detect slow-moving inventory at risk of waste | Manager, Admin |
| `GET` | `/api/ai/delay-prediction` | Bottleneck & late order probability estimation | Staff+ |
| `GET` | `/api/ai/sales-insights` | Natural language sales summary & takeaways | Manager, Admin |

### 🛡️ Admin & Governance (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/users` | List registered accounts and assign roles | Admin |
| `PATCH` | `/api/admin/users/:id/role-status` | Modify user permissions and active status | Admin |
| `GET` | `/api/admin/logs` | Query staff activity & system audit logs | Admin |
| `GET` | `/api/admin/settings` | Get slot capacities & operational limits | Admin |
| `PUT` | `/api/admin/settings` | Update max orders/slot & order thresholds | Admin |

---

## 👥 Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| **Customer** | Browse menu, reserve pickup slots, place pre-orders, view digital token & QR, cancel unstarted orders. |
| **Staff** | Access Live Kitchen Display (KDS), transition order prep states, flag delays, scan QR / verify pickup tokens. |
| **Manager** | Manage menu catalog & prices, view real-time KPI dashboard, generate sales reports, view AI insights. |
| **Admin** | Full system control: Manage staff roles, configure slot capacities & limits, review audit logs. |

---

## 📁 Folder Structure

```
SmartCanteen/
├── .env                     # Environment configuration
├── .env.example             # Example environment template
├── package.json             # Root npm scripts & Next.js config
├── tsconfig.json            # TypeScript configuration
├── PROJECT_EXPLANATION.md   # Detailed architecture & technical specification
├── README.md                # Project documentation
│
├── app/                     # Next.js App Router (Frontend)
│   ├── layout.tsx           # Root layout & styling
│   └── page.tsx             # Main dashboard / landing UI
│
└── backend/                 # Node.js + Express Backend API
    ├── package.json         # Backend dependencies & scripts
    └── src/
        ├── app.js           # Express app, middleware & route definitions
        ├── server.js        # HTTP & Socket.io server entry point
        ├── config/          # DB connection & system constants
        ├── controllers/     # Route logic for auth, menu, orders, AI, etc.
        ├── middleware/      # JWT auth, RBAC, and error handlers
        ├── models/          # Mongoose Schemas (User, Order, MenuItem, etc.)
        ├── routes/          # Express route definitions
        ├── seed/            # Default database seed script
        ├── services/        # Queue calculation, 15-min slots, AI algorithms
        └── utils/           # QR generator, Token builder (C-001)
```

---

## 📄 License
This project is open-source and built for Hackathon Problem-Solving Competitions.
