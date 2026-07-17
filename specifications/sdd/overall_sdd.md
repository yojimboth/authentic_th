# Software Design Document: Core Backend & Infrastructure
**Project:** authentic_th  
**Standard:** ISO/IEC/IEEE 1016:2009  
**Scope:** Overall SDD (Core Backend and Infrastructure)  
**Status:** Draft / Architectural Specification

---

## 1. Rust Workspace Design (Backend)

The system is designed as a **Modular Monolith** using a Rust Workspace. This allows for strict boundary enforcement between domains while maintaining a single deployment artifact for simplified infrastructure management.

### 1.1 Workspace Layout
The codebase is organized into functional crates to prevent "big ball of mud" dependencies.

```text
authentic_th/
├── Cargo.toml              # Workspace configuration
├── crates/
│   ├── auth/               # Identity, JWT, RBAC, Session management
│   ├── tenants/            # Tenant provisioning, subscription, isolation logic
│   ├── orders/             # Order lifecycle, state machine, validation
│   ├── loyalty/            # Points calculation, rewards, transaction ledgers
│   ├── common/             # Shared types, Error model, DB connection pooling
│   └── api_gateway/        # Axum router, Middleware, OpenAPI definitions
└── migrations/             # SQLx migrations for PostgreSQL
```

### 1.2 Crate Details & Contracts

#### `common` (The Foundation)
- **Key Structs**: `AppContext` (contains `PgPool`, `RedisPool`, `Config`).
- **Trait Contracts**: `Repository<T>` (Standard CRUD operations for domain entities).

#### `auth` (Identity Service)
- **Key Structs**: `User`, `Role`, `Permission`, `Claims`.
- **Enums**: `Role { SuperAdmin, StoreManager, Staff }`.
- **Contract**: `AuthService` trait providing `verify_token(token) -> Result<Claims, AuthError>`.

#### `tenants` (Isolation Service)
- **Key Structs**: `Tenant`, `TenantConfig`.
- **Contract**: `TenantGuard` middleware that extracts `tenant_id` from JWT or Headers and injects it into the request state.

#### `orders` (Transaction Service)
- **Key Structs**: `Order`, `OrderItem`, `OrderPayment`.
- **Enums**: `OrderStatus { Pending, Paid, Preparing, Completed, Cancelled }`.

### 1.3 Error Model (Canonical Taxonomy)
To ensure consistent API responses, the system utilizes a hierarchical error model using `thiserror` for internal errors and a custom `ApiError` for external responses.

| Error Category | Rust Type | HTTP Mapping | Description |
| :--- | :--- | :--- | :--- |
| **Validation** | `ValidationError` | 400 Bad Request | Input fails business rules or schema. |
| **Authentication**| `AuthError` | 401 Unauthorized | Invalid or expired JWT. |
| **Authorization** | `PermissionError` | 403 Forbidden | User lacks required RBAC role. |
| **Not Found** | `EntityNotFoundError`| 404 Not Found | Resource missing for specific `tenant_id`. |
| **Infrastructure**| `InternalError` | 500 Internal Error | DB connection failure or Redis timeout. |
| **Conflict** | `ConflictError` | 409 Conflict | State transition invalid (e.g., cancelling completed order). |

### 1.4 Async Design
- **Runtime**: `tokio` (Multi-threaded) for high-concurrency I/O.
- **Request Handling**: Axum's asynchronous handlers utilize `Extension` or `State` to share thread-safe pools (`Arc<PgPool>`).
- **Background Tasks**: `tokio::spawn` for non-blocking operations (e.g., sending notification emails or firing printer relays).

---

## 2. Data Design (Information View)

### 2.1 Database Schema (PostgreSQL)
The system employs a **Shared Schema, Discriminator Column** approach to multi-tenancy. Every table containing tenant-specific data MUST include a `tenant_id` column.

#### Core Entities
- **`tenants`**: `id (UUID, PK)`, `name`, `domain`, `subscription_plan`, `logo_url (TEXT, nullable)`, `created_at`.
- **`users`**: `id (UUID, PK)`, `tenant_id (FK)`, `email`, `password_hash`, `role_id (FK)`.
- **`orders`**: `id (UUID, PK)`, `tenant_id (FK)`, `customer_id`, `total_amount`, `status`, `created_at`.
- **`menus`**: `id (UUID, PK)`, `tenant_id (FK)`, `category`, `item_name`, `price`, `is_available`.
- **`loyalty_transactions`**: `id (UUID, PK)`, `tenant_id (FK)`, `user_id (FK)`, `points_delta`, `reason`.

**Isolation Strategy**: 
All queries are appended with `WHERE tenant_id = $1`. This is enforced via the `TenantGuard` middleware providing the ID to the repository layer.

### 2.2 Caching Strategy (Redis)
Redis is used as a distributed cache to reduce DB load and latency.

- **Session Storage**: Stores active JWT blacklists and refresh tokens (TTL based).
- **Menu Caching**:
    - **Key**: `menu:{tenant_id}`
    - **Value**: JSON representation of the menu.
    - **Invalidation**: "Write-through" - Cache is deleted whenever a menu update occurs via the admin panel.
- **Rate Limiting**: Fixed-window counters per IP/API Key to prevent DDoS.

---

## 3. System Integration Spec (The Seam)

### 3.1 Contract Standard
- **Specification**: OpenAPI 3.x.
- **Format**: JSON/UTF-8.
- **Tooling**: `utoipa` for generating OpenAPI specs directly from Rust types.

### 3.2 API Design
Base Path: `/api/v1`

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/tenants` | `POST` | Create new tenant account | SuperAdmin |
| `/tenants/{id}/config`| `PATCH` | Update tenant settings | StoreManager |
| `/orders` | `POST` | Create new customer order | Public/Auth |
| `/orders/{id}` | `GET` | Retrieve order status | Staff/Customer |
| `/loyalty/balance` | `GET` | Check user points | Customer |

### 3.3 Auth Flow
1. **Handshake**: User submits credentials $\rightarrow$ `/auth/login`.
2. **Issuance**: Server returns `access_token` (Short-lived JWT) and `refresh_token` (Long-lived, DB-stored).
3. **Header**: `Authorization: Bearer <jwt_token>`.
4. **JWT Claims**:
   ```json
   {
     "sub": "user_uuid",
     "tid": "tenant_uuid",
     "role": "Staff",
     "exp": 1720650000
   }
   ```
5. **Renewal**: Client calls `/auth/refresh` with `refresh_token` to acquire a new `access_token`.

### 3.4 Shared DTOs (Data Transfer Objects)
Common response shapes ensure frontend consistency:
- **TenantInfo DTO**: `{ "name": "String", "domain": "String", "logo_url": "String?" }`
- **Success Response**: `{ "status": "success", "data": { ... } }`
- **Error Response**: `{ "status": "error", "error": { "code": "VAL_001", "message": "Invalid email format" } }`
- **Paginated Response**: `{ "data": [...], "meta": { "total": 100, "page": 1, "per_page": 20 } }`

---

## 4. Common Services

### 4.1 Printer Relay Logic
To bridge the gap between the cloud backend and local physical printers:
1. **Order Trigger**: When an order is marked `Paid`, the `orders` crate emits a `PrintOrder` event.
2. **Relay Queue**: The event is pushed to a Redis Queue (`printer_queue:{tenant_id}`).
3. **Local Agent**: A lightweight local service (on-site) polls the queue or maintains a WebSocket connection.
4. **Command Translation**: The agent translates the JSON order into ESC/POS or ZPL printer commands.
5. **Acknowledgement**: The agent sends a `PrintSuccess` callback to Axum to update the order status to `Preparing`.

### 4.2 Stripe Integration
1. **Payment Intent**:
   - Axum creates a `PaymentIntent` via Stripe API $\rightarrow$ returns `client_secret` to Frontend.
2. **Payment Execution**:
   - Frontend handles card entry via Stripe Elements $\rightarrow$ Stripe processes payment.
3. **Verification (Webhook)**:
   - Stripe sends `payment_intent.succeeded` to `/api/v1/webhooks/stripe`.
   - Backend verifies Stripe signature $\rightarrow$ updates `orders` table status to `Paid`.

---

## 5. Traceability Matrix

| Design Component | BRD/SAD Requirement ID | Description |
| :--- | :--- | :--- |
| **Multi-tenant Schema** | `BMR-001` | Ensures strict data isolation using `tenant_id` discriminator. |
| **PDPA Compliance** | `BOR-001` | RBAC + JWT ensures only authorized personnel access PII. |
| **Printer Relay** | `BOR-002` | Facilitates physical order printing in merchant stores. |
| **Rust/Axum Stack** | `SAD-1` | Provides memory safety and high performance for core API. |
| **JWT/RBAC** | `SAD-Security` | Implements secure authentication and role based access. |
| **Docker Distroless** | `SAD-Infra` | Reduces attack surface for cloud deployment. |
