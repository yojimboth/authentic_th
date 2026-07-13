# Test Specification: authentic_th Ecosystem

**Version**: 1.0  
**Standard**: ISO/IEC/IEEE 29119-3 (Software Testing)  
**Project**: authentic_th Multi-tenant Food Ordering System  
**Status**: Specification Final

---

## 1. Testing Strategy

The `authentic_th` project utilizes a rigorous testing strategy designed to ensure extreme data isolation (multi-tenancy) and critical reliability for financial transactions and hardware integration.

### 1.1 Testing Pyramid
We adhere to a classic testing pyramid to optimize feedback loops and resource allocation.

| Level | Focus | Target Ratio | Tooling |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | Pure business logic, DTO validation, Error mapping. | 70% | `cargo test` (Rust), `Vitest` (JS/TS) |
| **Integration Tests** | API endpoints $\rightarrow$ DB, Redis interactions, Middleware. | 20% | `testcontainers` (Postgres/Redis), `Axum` test clients |
| **E2E Tests** | Critical user journeys (Order $\rightarrow$ Payment $\rightarrow$ Print). | 10% | `Playwright` (Web), `Detox` (Mobile) |

### 1.2 Environment & Mocking Strategy
Due to dependencies on external vendors and local hardware, the following environment strategy is mandated:

*   **Mock Data Source**: All tests should use the authoritative **Mock Data Specification** (`specifications/mocks/mock_data.md`) for consistent entities (Users, Tenancy, Menus).
*   **Stripe Integration**: 
    *   *Development/Testing*: Use **Stripe Test Mode** keys.
    *   *Unit/Integration Tests*: Use a **Mock Stripe Client** that simulates successful `PaymentIntent` and simulated Webhook payloads to verify backend state transitions without network calls.
*   **Printer Relay**: 
    *   *Development*: Use a **Virtual Relay Agent** that logs "Print" commands to a console instead of a physical device.
    *   *Verification*: Tests must verify that the backend correctly pushes a JSON payload to the Redis `printer_queue:{tenant_id}`.
*   **Database**: 
    *   Use ephemeral **Docker containers** (via `testcontainers-rs`) for every integration test suite to ensure a clean state and prevent cross-test pollution.

### 1.3 PDPA & Security Verification
To ensure compliance with the Australian Personal Data Protection Act (PDPA), the following specialized tests are required:

*   **Data Redaction Test**: Trigger a "Right to be Forgotten" request $\rightarrow$ Query the database for the `user_id` across ALL tables (Orders, Loyalty, Users) $\rightarrow$ Verify no PII remains (either hard-deleted or anonymized).
*   **Leak Prevention**: Automated "Cross-Tenant Probes" where an authenticated request for `Tenant A` attempts to access `Order ID` belonging to `Tenant B` $\rightarrow$ Must return `404 Not Found` or `403 Forbidden`.

---

## 2. Traceability Matrix

This matrix maps every "shall" statement from the **BRD** to a verifiable test case.

| Req ID | Test Case ID | Test Level | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **BMR-001** | `TC-TEN-01` | Integration | Create 2 tenants; verify Tenant A cannot see Tenant B's menu. |
| **BMR-002** | `TC-ADM-01` | E2E | Platform Admin updates global loyalty rate $\rightarrow$ reflected in all stores. |
| **BMR-003** | `TC-PAY-01` | E2E | Customer pays via Stripe $\rightarrow$ Order status moves to `Paid`. |
| **BMR-004** | `TC-LOY-01` | Unit | Order completion increments loyalty points based on config. |
| **BMR-005** | `TC-REP-01` | Integration | Admin query returns aggregated sales across multiple `tenant_id`s. |
| **BOR-001** | `TC-SEC-01` | Integration | User deletion triggers hard-purge of PII from DB (PDPA check). |
| **BOR-002** | `TC-PRT-01` | Integration | `Paid` order status triggers event in Redis `printer_queue`. |
| **BOR-003** | `TC-TEN-02` | Integration | API request with `tenant_id_1` JWT fails to fetch `tenant_id_2` data. |
| **BOR-004** | `TC-RBAC-01`| Unit | User with `Staff` role cannot access `/api/v1/tenants` (403). |
| **BOR-005** | `TC-FIN-01` | Unit | System calculates correct split between Platform and Restaurant. |
| **UR-C01** | `TC-UI-C01` | E2E | Customer opens Storefront $\rightarrow$ Menu loads correctly from API. |
| **UR-C02** | `TC-UI-C02` | E2E | Customer completes checkout $\rightarrow$ receives "Order Confirmed" screen. |
| **UR-C03** | `TC-UI-C03` | E2E | Customer redeems points $\rightarrow$ Total price decreases in order summary. |
| **UR-C04** | `TC-UI-C04` | E2E | User logs in $\rightarrow$ Order history matches DB records. |
| **UR-C05** | `TC-UI-C05` | E2E | Non-member completes checkout without login redirect. |
| **UR-RO01** | `TC-UI-RO01`| E2E | Owner updates price in Admin Panel $\rightarrow$ Update reflected in Storefront. |
| **UR-RO02** | `TC-UI-RO02`| E2E | Order paid $\rightarrow$ Owner Mobile App receives push notification. |
| **UR-RO03** | `TC-UI-RO03`| Integration | Owner requests report $\rightarrow$ Only data for their `tenant_id` is returned. |
| **UR-A01** | `TC-UI-A01` | E2E | Admin suspends tenant $\rightarrow$ Storefront returns `503 Service Unavailable`. |
| **UR-A02** | `TC-UI-A02` | E2E | Admin changes loyalty point multiplier $\rightarrow$ New orders earn updated points. |
| **UR-A03** | `TC-UI-A03` | Integration | Admin dashboard displays health status (up/down) of all tenants. |

---

## 3. Detailed Test Cases

### 3.1 Payment Flow (Critical Path)
**TC-PAY-01: End-to-End Payment Lifecycle**
1. **Step**: Customer submits order $\rightarrow$ Backend creates `PaymentIntent`.
   - **Expected**: Backend returns `client_secret` and order is marked `Pending`.
2. **Step**: Frontend submits card details to Stripe $\rightarrow$ Stripe returns `succeeded`.
   - **Expected**: Frontend receives success signal.
3. **Step**: Stripe sends `payment_intent.succeeded` webhook to `/api/v1/webhooks/stripe`.
   - **Expected**: Backend verifies signature $\rightarrow$ Order status $\rightarrow$ `Paid`.
4. **Step**: Verify `PrintOrder` event is fired.
   - **Expected**: Order appears in Redis `printer_queue:{tenant_id}`.

**TC-PAY-02: Card Declined (Unhappy Path)**
1. **Step**: Use Stripe "Declined" test card.
2. **Expected**: Stripe SDK returns error $\rightarrow$ Frontend shows "Payment Failed" $\rightarrow$ Order remains `Pending`.

### 3.2 Multi-tenancy Leak Test (Security Path)
**TC-TEN-02: Unauthorized Cross-Tenant Access**
1. **Setup**: 
   - Create `Tenant_1` and `Tenant_2`.
   - Create `Order_A` (belongs to `Tenant_1`).
   - Generate JWT for `User_B` (belongs to `Tenant_2`).
2. **Action**: Call `GET /api/v1/orders/{Order_A_ID}` using `User_B`'s JWT.
3. **Verification**:
   - **HTTP Status**: `404 Not Found` (to prevent revealing the existence of the ID) or `403 Forbidden`.
   - **Logs**: Log entry showing "Tenant mismatch: Request Tenant {T2} vs Entity Tenant {T1}".

### 3.3 Printer Relay (Hardware Path)
**TC-PRT-01: Redis Queue Population**
1. **Action**: Update an order status to `Paid` via API.
2. **Verification**: Inspect Redis key `printer_queue:{tenant_id}`.
3. **Expectation**: Key contains a JSON object with:
   - `order_id`, `items` (list), `customer_name`, `timestamp`, and `tenant_id`.

---

## 4. Verification Tools

### 4.1 Backend (Rust/Axum)
*   **Unit Testing**: `cargo test` for domain logic in `crates/orders`, `crates/loyalty`, etc.
*   **Integration Testing**: 
    *   `testcontainers-rs` to spin up PostgreSQL and Redis.
    *   `axum::Router` tests using `tower::ServiceExt` to simulate HTTP requests without binding to a socket.
*   **Database Migrations**: `sqlx migrate run` verified against a test DB before every suite.

### 4.2 Frontend (React/Expo)
*   **Component Testing**: `Vitest` + `React Testing Library` to verify UI states (e.g., "Loading" $\rightarrow$ "Success").
*   **E2E Testing**: `Playwright` for the Governance and Storefront web apps; `Detox` for mobile app interaction flows.
*   **State Verification**: Testing Zustand store transitions in isolation.

### 4.3 API & Infrastructure
*   **API Surface**: `Postman` collections for manual verification of OpenAPI specs.
* **Performance**: `k6` to verify that the "Order submission $\rightarrow$ Printer trigger" latency is $< 3$ seconds (QR-02).
* **Security**: `owasp-zap` for basic vulnerability scanning of the API gateway.
