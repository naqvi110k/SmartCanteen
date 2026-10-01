# Smart Canteen - Pre-Order & Queue Management System

AI-assisted real-time smart canteen food pre-ordering, digital token generation, and kitchen queue management system.

---

## 🚀 Backend Architecture & Features

- **A1: Atomic Stock & Slot Capacity Updates**: Conditional atomic decrements (`$gte`) preventing overselling on race conditions.
- **A2: Idempotency & Concurrency Safety**: Unique compound indexes preventing duplicate order submissions on double-clicks.
- **A3: Strict Status State Machine**: Enforced status transition flow (`Placed` -> `Accepted` -> `Preparing` -> `Ready` -> `Collected` / `Not Collected` -> `Completed`) rejecting illegal jumps with 409 status.
- **A4: Single-Use Digital Token Collection**: Atomic verification & single-use token handover preventing duplicate order pickups.
- **A5 & A6: Zod Validation & Security**: Schema validation, rate limiting on auth routes, bcrypt password hashing, and role-based access control (RBAC).
- **A7: Dynamic ETA & Live Queue Sorting**: Queue priority scoring formula `ETA = now + (queued prep work ÷ number of cooks) + own prep time`.
- **A8: Background Monitor Service**: Recurring cron-style background checker handling delay flagging, uncollected timeouts, and approaching pickup alerts.
- **A9: AI Analytics & Predictions Engine**: Real-time sales insights, food demand predictions, peak-time congestion forecasting, and waste risk analysis.
- **A10: Express 5 Centralized Error Handling**: Unified `asyncHandler` and standardized error responses.

---

## 🛠️ Getting Started

### 1. Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_canteen
JWT_SECRET=smart_canteen_super_secret_jwt_key_2026
NODE_ENV=development
CLIENT_ORIGIN=*
```

### 2. Running Backend
```bash
# Start backend directly
node backend/src/server.js
# Or with nodemon
npm run backend:dev
```

Server runs at: `http://localhost:5000`  
Health Check: `http://localhost:5000/api/health`

### 3. Running Next.js Frontend
```bash
npm run dev
```

---

## 📚 Backend API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create customer account
- `POST /api/auth/login` - Authenticate and obtain JWT token
- `GET /api/auth/me` - Get authenticated profile

### Menu Items (`/api/menu`)
- `GET /api/menu` - Browse menu with category, search, and price filters
- `GET /api/menu/:id` - Get item details
- `PATCH /api/menu/:id/availability` - Real-time stock toggle (`Staff`, `Manager`, `Admin`)
- `POST /api/menu`, `PUT /api/menu/:id`, `DELETE /api/menu/:id` - Menu CRUD (`Manager`, `Admin`)

### Pre-Orders & Queue (`/api/orders`, `/api/queue`)
- `GET /api/orders/pickup-slots` - Get 15-minute slot capacities
- `POST /api/orders` - Place pre-order (with stock decrement, token & QR generation)
- `GET /api/orders` - Get order history
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order before prep starts
- `GET /api/queue/live` - Live kitchen queue ordered by priority and pickup time
- `PATCH /api/queue/:id/status` - Transition order status (`Preparing`, `Ready`, etc.)
- `PATCH /api/queue/:id/delayed` - Flag order as delayed with reason

### Collection Counter (`/api/collection`)
- `POST /api/collection/verify` - Verify token or QR code (single-use validation)
- `POST /api/collection/confirm` - Confirm order handover and mark `Completed`

### Analytics & AI (`/api/analytics`, `/api/ai`)
- `GET /api/analytics/dashboard` - Real-time sales, order counts, and queue statistics
- `GET /api/analytics/reports` - Advanced management analytics
- `GET /api/ai/demand-prediction` - Food demand forecasting
- `GET /api/ai/peak-time-prediction` - Canteen traffic peak estimation
- `GET /api/ai/prep-forecasting` - Kitchen batch prep recommendations
- `GET /api/ai/recommendations` - Smart menu suggestions
- `GET /api/ai/waste-prediction` - Food waste risk detection
- `GET /api/ai/delay-prediction` - Bottleneck prediction
- `GET /api/ai/sales-insights` - AI executive sales summary

### Admin (`/api/admin`)
- `GET /api/admin/users` - View registered users
- `PATCH /api/admin/users/:id/role-status` - Manage user roles & permissions
- `GET /api/admin/logs` - Audit logs of staff and order actions
- `GET /api/admin/settings` - Canteen operating limits & slot configuration
- `PUT /api/admin/settings` - Update operational limits
