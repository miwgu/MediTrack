# Full-stack MediTrack - React + Node.js + Express.js + Docker 

## 📚 Overview

MediTrack is an internal healthcare system that replaces manual medicine ordering processes such as paper-based lists and email communication within hospital units.

It ensures that nurses, pharmacists, and warehouse staff have access to accurate and up-to-date information about medicine orders and inventory, reducing the risk of ordering errors and improving operational safety and efficiency.

**Key flows:**
- Nurses browse medicines, add them to an order request, and submit to the pharmacist
- Pharmacists review and confirm orders
- Warehouse staff marks confirmed orders as delivered, automatically updating stock levelsDescribe your project briefly.


---
## ✅ Features
### Medicine Management
- List medicines with name, ATC code, form, strength, and stock level
- Search by name or ATC code, filter by form
- Stock status indicator — **In Stock** / **⚠️ Low Stock** (when below threshold)
- Add, edit, and soft-delete medicines (Pharmacist only)
- ATC code uniqueness validation on create and update
- Soft delete — inactive medicines are hidden but preserved in order history

### Order Management
- Nurses create order requests via a request basket (localStorage-based draft)
- Orders follow a strict status flow: `DRAFT → SENT → CONFIRMED → DELIVERED`
- Stock is automatically decreased when an order is marked as DELIVERED
- Filter orders by ID, unit, and status
- Role-based status visibility (Nurse / Pharmacist / Warehouse)

### Role-Based UI (Mock)
- Login as Nurse, Pharmacist, or Warehouse (no authentication — mock only)
- UI controls and navigation adapt per role
- Role state persisted in localStorage

---
## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Bootstrap |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |

---

## 🧠 Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   React Frontend │──────▶│  Express Backend │──────▶│   PostgreSQL DB  │
│   (port 4173)    │       │   (port 3000)    │       │   (port 5433)    │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

**Backend structure follows separation of concerns:**
```
Controller → Service → Repository → Database
```
- **Controller** — handles HTTP request/response
- **Service** — business logic, validation, status transition rules
- **Repository** — database queries only

---

## 💬 Order Flow

```
Nurse adds medicines to Order Request (localStorage)
      ↓
Submits → POST /api/orders → status: SENT
      ↓
Pharmacist reviews → PATCH /api/orders/:id/status → CONFIRMED
      ↓
Warehouse ships → PATCH /api/orders/:id/status → DELIVERED
      ↓
Stock automatically decreased for each medicine in the order
```
---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone 
cd MediTrack
```

### 2. Create `.env` file in the project root
```bash
# Server
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=meditrack

# Frontend
FRONTEND_ORIGIN=http://localhost:4173
VITE_BACKEND_URL=http://localhost:3000
```
### 3. Start containers
- See Docker Container Setup
---

## 🐳Docker Container Setup 

1. Start Containers
```bash
docker compose up -d --build
```
> This command automatically builds and starts all containers.
You don’t need to manually create the database or register knowledge — these are handled automatically when the backend container starts.

2. Check backed logs
> Verify that the knowledge base is successfully registered and the server is running.
```bash
docker logs meditrack-backend
```
3. Stop and Remove Containers (Optional)
```bash
docker compose down
```
>⚠️ Note: The knowledge embeddings are stored in the persistent PostgreSQL volume (postgres_data).
You do not need to re-run the registration script or rebuild the containers unless the volume or database is deleted.
---

## 💾 Database Setup with init.sql
You don’t need to do anything manually to set up the database.  
It is automatically created by `docker-compose.yml`.

The `postgres_data` volume is **persistent**, which means that even if you delete the container, the volume (and thus the database data) will remain. This is why the database may continue to operate with old data.

```yaml
environment:
  - POSTGRES_DB=${DB_NAME}
  - POSTGRES_USER=${DB_USER}
  - POSTGRES_PASSWORD=${DB_PASSWORD}
volumes:
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```
---

## 🔄 Resetting the Database

If you want to completely delete chatdb and create a new one:
```bash
docker compose down -v
```
>This will remove both the container and the persistent volume, so the database is recreated from scratch

- Rebuilds the image from the Dockerfile.
- All latest code and dependency changes are applied.
```bash
docker compose up -d --build
```
OR
- Reuses the existing image.
- Code changes are not reflected in the container.
```bash
docker compose up -d
```

---

## 📝 Accessing the Database
Login to the Postgres container (you will need to enter the password):
```bash
docker exec -it meditrack-postgres psql -U postgres -d meditrack
```
```sql
\dt               -- list tables
SELECT * FROM medicines;
SELECT * FROM orders;
```


---

## 📈 API Endpoints

### Medicines
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/medicines` | Get all active medicines (search, form filter) |
| GET | `/api/medicines/:id` | Get medicine by ID |
| POST | `/api/medicines` | Create medicine |
| PATCH | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Soft delete medicine |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get all orders (unit, status, id filter) |
| GET | `/api/orders/:id` | Get order with items |
| POST | `/api/orders` | Create order (status: SENT) |
| PATCH | `/api/orders/:id/status` | Update order status |

---

## 🧪 Testing

```bash
cd backend
npm run test
```

| Test file | Tests |
|---|---|
| `medicine.service.test.ts` | 15 tests |
| `order.service.test.ts` | 17 tests |

Unit tests cover service layer business logic including:
- Input validation
- ATC code uniqueness check
- Soft delete and inactive medicine protection
- Order status transition rules
- Stock decrease on DELIVERED

---
## 🎨 Design Decisions

### Order Draft State
DRAFT orders are managed client-side via localStorage and are never persisted to the database.
DB entries start at SENT when the nurse submits the order.

**Trade-offs:**
- ✅ Simpler backend, no draft cleanup needed
- ❌ Draft is lost on browser refresh or device switch
- ❌ Cannot be shared between nurses on the same unit

In production, DRAFT would be persisted in DB to support multi-device access and shift handover.

### Stock Decrease on Delivery
When an order is marked as DELIVERED, stock is decreased for each medicine item individually.
**This is not wrapped in a transaction** — if one update fails midway, partial stock decreases may occur.

### Soft Delete for Medicines
Medicines are never hard-deleted. Setting `is_active = false` preserves order history integrity.

### Role-Based UI (Mock)
Authentication is not implemented. Role selection at login is for UI demonstration only.
In production, role-based access would be enforced via JWT and backend middleware.

### Frontend Order Filtering
Order filtering by role is currently handled on the frontend.
In production, filtering should be enforced on the backend based on the authenticated user's role.

---

## 📝 Known Limitations & Future Improvements

| Area | Current | Future |
|---|---|---|
| Authentication | Mock role selection | JWT + role-based middleware |
| Draft orders | localStorage only | Persist in DB, shareable between nurses |
| Medicine forms & units | Hardcoded | Managed via database tables |
| Ward/Unit list | Hardcoded | Managed via units table |
| Order editing | Not supported | Edit draft items before SENT |
| Soft delete admin API | DB access only | Admin endpoint with role protection |
| Medicine activation date | Not tracked | `activated_at` / `deactivated_at` timestamps |
| Integration tests | Not implemented | Supertest for API endpoints |
| E2E tests | Not implemented | Cypress for critical user flows |
| Concurrent updates | Not handled | Optimistic locking to prevent race conditions on stock updates |

