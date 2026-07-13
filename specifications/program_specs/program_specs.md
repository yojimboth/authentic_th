# Program Specifications: authentic_th Ecosystem

This document serves as the final technical blueprint for the `authentic_th` project. It translates high-level architecture (SAD) and detailed design (SDD) into implementation-ready logic for the Rust/Axum backend and React/Expo frontends.

---

## 1. Domain: Auth (`crates/auth`)

### Logic Flow & Pseudo-code
**Authentication Flow:**
1. `login(email, password)`:
   - Fetch `user` by email.
   - Verify `password_hash` using `argon2`.
   - Generate `access_token` (JWT, 15m) and `refresh_token` (Random UUID, 7d).
   - Store `refresh_token` in PostgreSQL associated with `user_id` and `device_id`.
   - Return both tokens.

**Authorization Flow (RBAC):**
- Middleware extracts `role` from JWT claims.
- Maps `role` $\rightarrow$ `permissions` set.
- If required permission for the endpoint is not in the set, return `403 Forbidden`.

### Final API Contract Detail
| Endpoint | Method | Request | Response (200) | Errors | Middleware |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | `{"email": str, "password": str}` | `{"access_token": str, "refresh_token": str, "user": UserDTO}` | `AUTH_001` (Invalid Creds) | Public |
| `/auth/refresh` | `POST` | `{"refresh_token": str}` | `{"access_token": str}` | `AUTH_002` (Expired Token) | Public |
| `/auth/logout` | `POST` | None | `{"status": "success"}` | `AUTH_003` (Invalid Session) | `AuthGuard` |

### Implementation Notes (Rust/Axum)
- **Hashing**: Use `argon2` for password hashing.
- **JWT**: Use `jsonwebtoken` crate. Claims must include `sub` (UserID), `tid` (TenantID), and `role`.
- **Session**: Store refresh tokens in a dedicated `auth_sessions` table to allow remote logout of specific devices.

### Frontend Integration Logic
- **Auth Store (Zustand)**:
  ```typescript
  interface AuthState {
    session: UserSession | null;
    setSession: (session: UserSession | null) => void;
    logout: () => void;
  }
  ```
- **Interceptors**: `apiClient.ts` must intercept `401` responses. If `401` is received, attempt a call to `/auth/refresh`. If that fails, trigger `authStore.logout()` and redirect to `/login`.

---

## 2. Domain: Tenants (`crates/tenants`)

### Logic Flow & Pseudo-code
**Tenant Provisioning:**
- `create_tenant(name, domain, plan)`:
  - Generate `tenant_id` (UUID v4).
  - Create entry in `tenants` table.
  - Create initial `SuperAdmin` user for the tenant.
  - Initialize default `TenantConfig` (Currency: AUD, Locale: en-AU).

### Final API Contract Detail
| Endpoint | Method | Request | Response (200) | Errors | Middleware |
| :--- | :--- | :, la | `{"name": str, "domain": str, "plan": PlanEnum}` | `{"tenant_id": UUID}` | `VAL_001` | `AdminAuth` |
| `/tenants/{id}/config` | `PATCH` | `{"settings": Partial<Config>}` | `{"status": "updated"}` | `NOT_FOUND`, `VAL_002` | `TenantGuard`, `AdminAuth` |

### Implementation Notes (Rust/Axum)
- **TenantGuard Middleware**:
  - Inspects `X-Tenant-ID` header or JWT `tid` claim.
  - Validates that the tenant exists and is `active` in the DB.
  - Injects `tenant_id` into `axum::Extension<TenantId>`.
- **SQLx Strategy**: Use a custom `QueryBuilder` or a trait that enforces `WHERE tenant_id = $1` on every select/update/delete.

### Frontend Integration Logic
- **Governance Portal**: Uses a global `activeTenant` state to switch contexts when managing multiple stores.

---

## 3. Domain: Orders (`crates/orders`)

### Logic Flow & Pseudo-code
**Order State Machine:**
`Pending` $\rightarrow$ `Paid` $\rightarrow$ `Preparing` $\rightarrow$ `Completed` (or $\rightarrow$ `Cancelled`)

**Process Payment Intent:**
1. Receive `cart_items` and `tenant_id`.
2. Calculate total on server (never trust frontend totals).
3. Call Stripe API `payment_intents.create`.
4. Store `PaymentIntentID` in `orders` table with status `Pending`.
5. Return `client_secret` to frontend.

**Webhook Handler (`payment_intent.succeeded`):**
1. Verify Stripe Signature.
2. Lookup order by `PaymentIntentID`.
3. Update order status to `Paid`.
4. Emit `PrintOrder` event $\rightarrow$ Push to Redis Queue `printer_queue:{tid}`.
5. Notify restaurant via WebSocket.

### Final API Contract Detail
| Endpoint | Method | Request | Response (200) | Errors | Middleware |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/orders` | `POST` | `{"items": Item[], "userId?": UUID}` | `{"order_id": UUID, "client_secret": str}` | `VAL_003` | `TenantGuard` |
| `/orders/{id}` | `GET` | None | `OrderDTO` | `NOT_FOUND` | `TenantGuard`, `AuthGuard` |
| `/orders/{id}/status`| `PATCH` | `{"status": OrderStatus}` | `{"status": "updated"}` | `CONFLICT_001` | `TenantGuard`, `StaffAuth` |

### Implementation Notes (Rust/Axum)
- **Concurrency**: Use `tokio::spawn` for sending notifications to avoid blocking the Stripe webhook response.
- **Printer Relay**: Use `redis-rs` for the `LPUSH` of order data into the tenant relay queue. The structure should be: `{"order_id": UUID, "items": [...], "timestamp": ISO8601}`.

### Frontend Integration Logic
- **Cart Store (Zustand)**:
  ```typescript
  interface CartState {
    items: CartItem[];
    addItem: (item: FoodItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
  }
  ```
- **Checkout Flow**: 
  - Frontend calls `/orders` $\rightarrow$ receives `client_secret` $\rightarrow$ passes to `Stripe.confirmPayment()`.
  - Upon Stripe success, frontend polls `/orders/{id}` or listens to WebSocket for the `Paid` transition before showing the confirmation screen.

---

## 4. Domain: Loyalty (`crates/loyalty`)

### Logic Flow & Pseudo-code
**Point Calculation (`calculate_loyalty_points`):**
- Input: `order_amount`, `tenant_id`.
- Fetch `loyalty_config` for the tenant (e.g., $1 = 1 point).
- Points = `floor(order_amount * config.multiplier)`.
- Insert record into `loyalty_transactions` (delta: positive).
- Update `users.loyalty_points` balance.

**Point Redemption:**
- Check if `user.loyalty_points >= required_points`.
- Subtract points from `users.loyalty_points`.
- Insert record into `loyalty_transactions` (delta: negative, reason: "Redemption").

### Final API Contract Detail
| Endpoint | Method | Request | Response (200) | Errors | Middleware |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/loyalty/balance` | `GET` | None | `{"points": int}` | `NOT_FOUND` | `TenantGuard`, `AuthGuard` |
| `/loyalty/redeem` | `POST` | `{"points": int, "order_id": UUID}` | `{"new_balance": int}` | `LOY_001` (Insufficient) | `TenantGuard`, `AuthGuard` |

### Implementation Notes (Rust/Axum)
- **Atomicity**: Wrap point subtraction and balance updates in a `sqlx::Transaction` to prevent race conditions.
- **Caching**: Cache the tenant's loyalty configuration in Redis: `loyalty_cfg:{tid}`. Invalidate on config update.

### Frontend Integration Logic
- **Profile Feature**: Display `loyaltyPoints` from the `UserSession` DTO. Refresh points via `/loyalty/balance` when the user returns to the app.

---

## 5. Domain: Governance (`crates/api_gateway` + Internal)

### Logic Flow & Pseudo-code
**Z-Report Generation (`generate_z_report`):**
1. Define time window (start $\rightarrow$ end).
2. Sum `total_amount` from `orders` where `status = 'Completed'` and `tenant_id = :tid`.
3. Group by `category` (via `menu` join) to provide a product-mix analysis.
4. Calculate total loyalty points issued vs. redeemed.
5. Return aggregated JSON for frontend charting.

### Final API Contract Detail
| Endpoint | Method | Request | Response (200) | Errors | Middleware |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/gov/reports/z` | `GET` | `?start=ISO&end=ISO&tid=UUID` | `ZReportDTO` | `PERMISSION_001` | `SuperAdminAuth` |
| `/gov/tenants/suspend`| `POST` | `{"tenant_id": UUID}` | `{"status": "suspended"}` | `NOT_FOUND` | `SuperAdminAuth` |

### Implementation Notes (Rust/Axum)
- **Reporting Queries**: Use PostgreSQL `SUM()` and `COUNT()` aggregations. For very large datasets, implement a read-replica strategy in the future.
- **Security**: Implement a strict `SuperAdmin` role that is the only role allowed to bypass `TenantGuard` to query *across* all tenants for global reports.

### Frontend Integration Logic
- **Governance Portal**: Use `Recharts` or similar in the React web app to visualize the `ZReportDTO` (e.g., Revenue over time, Top 5 items).
