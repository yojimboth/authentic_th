# Software Design Description (SDD): System Admin Web App (Governance Portal)

**Project:** authentic_th  
**Standard:** ISO/IEC/IEEE 1016:2009  
**Scope:** Frontend Web Workspace Design for the Governance Portal  
**Status:** Final Specification  

---

## 1. Project Layout (Structure View)

The Governance Portal follows a **Feature-Based Architecture**. This pattern ensures that all logic related to a specific business domain (e.g., Tenant Management) is co-located, reducing cognitive load and preventing the "folder sprawl" common in large React applications.

### 1.1 Directory Tree
```text
src/
├── api/                    # Axios instance, interceptors, and base API clients
├── assets/                 # Global static assets (logos, icons, fonts)
├── components/             # Shared UI components (Atomic Design: Atoms, Molecules)
│   ├── ui/                 # Base components (Button, Input, Modal, Table)
│   └── layout/             # Page shells (AdminSidebar, TopNav, PageHeader)
├── config/                 # Environment variables and global constants
├── features/               # Domain-driven feature modules
│   ├── auth/               # Login, Session Management, Password Reset
│   ├── tenant-mgmt/        # UR-A01: Tenant CRUD, Status Control (Active/Suspended)
│   ├── billing-config/     # Global Fee Settings, Subscription Plan definitions
│   ├── global-reports/     # Aggregated KPIs, Revenue Analytics, System Health
│   ├── loyalty-settings/   # UR-A02: Global Loyalty Rules, Point Conversion Rates
│   └── compliance/         # PDPA audits, Data Purge requests, Privacy Logs
├── hooks/                  # Global reusable hooks (useAuth, useDebounce)
├── store/                  # Global state definitions (Zustand)
├── types/                  # Global TypeScript interfaces and Enums
└── utils/                  # Pure helper functions (date formatting, currency)
```

### 1.2 Feature Module Internal Structure
Each module within `features/` follows a consistent internal layout:
- `components/`: Feature-specific UI (e.g., `TenantTable.tsx`).
- `hooks/`: Feature-specific data fetching/logic (e.g., `useTenants.ts`).
- `services/`: API call definitions for that specific domain.
- `types/`: Domain-specific DTOs and interfaces.
- `pages/`: The actual route views using the components and hooks.

---

## 2. Component Architecture (Composition View)

### 2.1 Admin Dashboard (System Health & KPIs)
The dashboard serves as the entry point for the Founder/Co-founder.
- **KPI Tiles**: Real-time counters for Total Active Tenants, Total Orders (24h), Total GMV, and System Error Rate.
- **System Health Monitor**: A visual indicator of API latency and database health (connecting to `UR-A03`).
- **Active Alerts**: A notification feed for tenant subscription expirations or critical system failures.

### 2.2 Management Tables (Complex Data Grids)
Used extensively in `tenant-mgmt` and `compliance`.
- **Implementation**: A generic `DataTable<T>` wrapper.
- **Capabilities**:
    - **Server-side Pagination**: Utilizing the `meta` object defined in the Overall SDD.
    - **Multi-column Filtering**: Filter by tenant status, domain, or creation date.
    - **Action Menu**: Contextual actions (e.g., "Suspend Tenant", "Edit Config") per row.

### 2.3 Configuration Forms
Used in `billing-config` and `loyalty-settings`.
- **Dynamic Input Fields**: Support for toggling between "Fixed Fee" (Numeric input) and "Percentage Fee" (Percentage slider/input).
- **Validation**: Zod-based schema validation for all admin inputs to ensure `SAD` data integrity.
- **Audit Logging**: Every change triggers a confirmation modal indicating that the action is logged for PDPA compliance.

### 2.4 Styling Strategy
- **Framework**: Tailwind CSS / NativeWind (Web compatibility).
- **Design Tokens**:
    - **Colors**: Neutral-heavy palette (Slate/Zinc) with high-contrast primary accents (Indigo/Violet) for "Admin" branding.
    - **Responsiveness**: Sidebar-collapsible layout for tablet and desktop views.

---

## 3. Type System (Logical View)

### 3.1 Admin-Specific DTOs
Based on the Rust backend entities in the Overall SDD.

```typescript
// types/tenant.ts
export interface TenantAccount {
  id: string;              // UUID
  name: string;
  domain: string;
  subscriptionPlan: 'Free' | 'Basic' | 'Enterprise';
  status: 'Active' | 'Suspended' | 'Pending';
  createdAt: string;       // ISO Date
}

// types/billing.ts
export interface GlobalFeeConfig {
  feeType: 'FIXED' | 'PERCENTAGE';
  feeValue: number;
  currency: string;        // e.g., "AUD"
  effectiveDate: string;
}

// types/health.ts
export interface SystemHealthMetric {
  cpuUsage: number;
  memoryUsage: number;
  apiLatencyMs: number;
  dbConnections: number;
  timestamp: string;
}
```

### 3.2 RBAC Types
Handling the hierarchy defined in `BOR-004`.

```typescript
export enum AdminRole {
  FOUNDER = 'FOUNDER',
  CO_FOUNDER = 'CO_FOUNDER'
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  permissions: string[]; // e.g., ['manage_tenants', 'edit_fees', 'view_reports']
}
```

---

## 4. State Management (State Dynamics View)

### 4.1 Global State (Zustand)
Used for client-side state that persists across page navigations.
- **`useAuthStore`**: Stores the current `AdminUser` profile and JWT.
- **`useUIStore`**: Manages sidebar collapse state, theme preferences, and global loading indicators.

### 4.2 Server State (TanStack Query)
Used for all data fetched from the Rust/Axum API.
- **Caching**: Aggressive caching for `GlobalFeeConfig` and `LoyaltyRules` (invalidated only on PUT).
- **Polling**: The `SystemHealthMetric` query uses a 30-second polling interval to keep the dashboard current.
- **Optimistic Updates**: When suspending a tenant, the UI updates immediately while the API request processes.

### 4.3 Persistence
- **JWT Storage**: Stored in `httpOnly` cookies (preferred) or LocalStorage with a short TTL.
- **Preferences**: Admin layout preferences stored in `localStorage`.

---

## 5. Integration Layer (Interface View)

### 5.1 API Client
- **Library**: Axios.
- **Interceptors**:
    - **Request**: Automatically injects `Authorization: Bearer <token>` into all headers.
    - **Response**: Intercepts `401 Unauthorized` to trigger an automatic redirect to the `/auth/login` page.
    - **Error Handling**: Maps backend `ApiError` codes (e.g., `VAL_001`) to user-friendly toast notifications.

### 5.2 Route Mapping
| UI Route | Feature Module | API Endpoint (Overall SDD) | Method |
| :--- | :--- | :--- | :--- |
| `/login` | `auth` | `/api/v1/auth/login` | `POST` |
| `/tenants` | `tenant-mgmt` | `/api/v1/tenants` | `GET` |
| `/tenants/create`| `tenant-mgmt` | `/api/v1/tenants` | `POST` |
| `/billing` | `billing-config`| `/api/v1/governance/fees` | `GET/PATCH` |
| `/loyalty` | `loyalty-settings`| `/api/v1/governance/loyalty`| `GET/PATCH` |
| `/health` | `global-reports` | `/api/v1/system/health` | `GET` |

---

## 6. Interaction Flow (Runtime View)

### 6.1 Tenant Onboarding Flow
1. **Trigger**: Admin navigates to `/tenants/create`.
2. **Input**: Admin enters Restaurant Name, Domain, and Owner Email.
3. **API Call**: `POST /api/v1/tenants`.
4. **Process**:
    - Backend creates `Tenant` entry (UUID).
    - Backend initializes default `TenantConfig`.
    - Backend sends invitation email to Owner.
5. **UI Update**: Navigation to Tenant Detail page $\rightarrow$ status displays as `Pending`.

### 6.2 Fee Modification Flow
1. **Trigger**: Admin updates fee from $2.00 to $2.50 in `/billing`.
2. **Validation**: Frontend checks for negative values.
3. **API Call**: `PATCH /api/v1/governance/fees`.
4. **Process**:
    - Backend updates `GlobalFeeConfig` in PostgreSQL.
    - Backend invalidates the `fee_config` Redis cache.
5. **Effect**: All subsequent orders across all tenants now utilize the new $2.50 fee for calculation.

---

## 7. Traceability Matrix

| Design Component | BRD Requirement | Description |
| :--- | :--- | :--- |
| **`tenant-mgmt` Module** | `UR-A01` | Implements CRUD, suspension, and deletion of tenant accounts. |
| **`loyalty-settings` Module** | `UR-A02` | Provides interface to define global loyalty point rules. |
| **`global-reports` / Health** | `UR-A03` | Implements operational health monitoring via system metrics. |
| **`compliance` Module** | `BOR-001` | Implements PDPA data handling and audit logs for Admin actions. |
| **`RBAC Type System`** | `BOR-004` | Distinguishes access rights between Founder and Co-founder roles. |
