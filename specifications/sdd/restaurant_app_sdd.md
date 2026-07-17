# Software Design Description (SDD): Restaurant Mobile App
**Project:** authentic_th  
**Standard:** ISO/IEC/IEEE 1016:2009 (Frontend/Mobile View)  
**Version:** 1.0  
**Status:** Draft  
**Traceability:** BRD UR-RO01, UR-RO02, UR-RO03 | SAD Section 3.2

---

## 1. Project Layout (Structure View)

The Restaurant application follows a **Feature-Based Architecture** aligned with the Customer App. This ensures consistent development patterns across both applications while maintaining clear separation of concerns for restaurant-specific operations.

### 1.1 Directory Tree
```text
src/
├── assets/              # Static assets (fonts, images, svg)
├── components/          # Shared UI components (Atomic Design: atoms, molecules)
│   ├── common/          # Button, Input, Typography, Loader, OrderCard
│   └── layout/          # Screen wrappers, SafeAreaView configs
├── constants/           # Theme tokens, API endpoints, config
├── features/            # Domain-driven feature modules
│   ├── auth/            # Restaurant owner login, session management
│   ├── orders/          # Order list, order detail, status updates
│   ├── menu/            # Product catalog management, availability toggle
│   ├── analytics/       # Sales reports, revenue charts, popular items
│   └── profile/         # Owner settings, printer configuration, tenant info
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific business logic
│       ├── services/    # Feature-specific API calls
│       ├── store/       # Local feature state (if applicable)
│       └── types/       # Feature-specific TypeScript interfaces
├── hooks/               # Global utility hooks (useAuth, useDebounce)
├── navigation/          # React Navigation config (Stacks, Tabs)
├── services/            # Global API client and interceptors
├── store/               # Global state management (Zustand)
└── utils/               # Pure helper functions (date formatting, currency)
```

### 1.2 Feature Isolation Strategy
Each folder within `features/` is treated as a semi-independent module.
- **Internal access**: Components in `features/orders/components` can freely use hooks in `features/orders/hooks`.
- **Cross-feature access**: If the `analytics` feature needs order data, it must go through the `store/` (Global State) or a defined service interface. This prevents circular dependencies.

---

## 2. Component Architecture (Composition View)

### 2.1 Presentational vs. Container Logic
The application employs a **Hook-Based Container Pattern** consistent with the Customer App.

- **Presentational Components**: Pure functions that receive data via props and emit events via callbacks. (e.g., `OrderStatusCard.tsx`, `MenuItemToggle.tsx`)
- **Logic (Hooks)**: Custom hooks handle the "container" responsibility: fetching data, managing local state, and interacting with the global store. (e.g., `useOrders.ts`, `useMenuManagement.ts`)

### 2.2 Key Component Tree

**Order Management Flow:**
`MainTabs` → `OrdersScreen` (OrderList) → `OrderCard` → `OrderStatusBadge` → `Accept/Prepare/Complete Buttons`

**Menu Management Flow:**
`MainTabs` → `MenuScreen` (MenuList) → `MenuItemCard` → `AvailabilityToggle` → `EditPriceModal`

**Analytics Flow:**
`MainTabs` → `AnalyticsScreen` (SummaryCards) → `RevenueChart` → `PopularItemsList`

### 2.3 UI Tokens (Styling)
Styling is implemented via **NativeWind (Tailwind CSS for React Native)** to ensure consistency with the Customer App.
- **Colors**: Defined in `tailwind.config.js` using brand-spec tokens (e.g., `brand-primary`, `brand-accent`, `neutral-dark`).
- **Spacing**: Standardized scale (4px increments) to maintain alignment.
- **Typography**: Shared `Typography` component to wrap `Text` with predefined styles (`h1`, `body`, `caption`).

---

## 3. Type System (Logical View)

### 3.1 Key DTOs (Data Transfer Objects)
TypeScript interfaces are mirrored from the Rust/Axum backend structs to ensure type safety across the wire.

```typescript
// src/features/orders/types/index.ts
export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
}

export interface Order {
  id: string;
  tenantId: string;
  customerId: string | null; // Anonymous if non-member
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  loyaltyDiscount: number;
  total: number;
  status: OrderStatus;
  fulfillmentMethod: 'delivery' | 'pickup';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// src/features/menu/types/index.ts
export interface MenuItem {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime?: number; // minutes
}

export interface MenuCategory {
  id: string;
  tenantId: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

// src/features/analytics/types/index.ts
export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  period: 'today' | 'week' | 'month';
}

export interface PopularItem {
  itemId: string;
  itemName: string;
  quantitySold: number;
  revenue: number;
}

// src/features/auth/types/index.ts
export interface RestaurantOwner {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'owner' | 'manager';
}
```

### 3.2 UI State Handling
To eliminate "boolean soup" (e.g., `isLoading`, `isError`), the app uses **Discriminated Unions** for screen states (consistent with Customer App).

```typescript
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

---

## 4. State Management (State Dynamics View)

### 4.1 Global State (Zustand)
A lightweight Zustand store is used for data that must persist across multiple screens and features.
- **Auth Store**: Manages `RestaurantOwner` session and authentication status.
- **Order Store**: Manages active orders with real-time updates (mocked polling for now).
- **Menu Store**: Manages menu items and availability state.

### 4.2 Server State (TanStack Query)
The application separates "Client State" from "Server State" using **React Query**.
- **Caching**: API responses (e.g., Orders, Menu items) are cached globally to prevent redundant network requests.
- **Mutations**: Used for actions like `updateOrderStatus` or `toggleMenuItemAvailability`, providing optimistic updates for a snappy UI.
- **Polling**: Orders are polled every 10 seconds (mocked) to simulate real-time updates from customer orders.

### 4.3 Persistence
- **JWT Storage**: `expo-secure-store` is used to encrypt and store the JWT `accessToken` on the device.
- **Session Lifecycle**: On app launch, a `useEffect` in the root provider checks `secure-store`; if a token exists, it hydrates the Auth Store and validates the session via a `/me` endpoint.

---

## 5. Integration Layer (Interface View)

### 5.1 API Client
An Axios instance is configured in `src/services/apiClient.ts`.

- **Base URL**: Configured via environment variables.
- **Interceptors**: 
    - **Request**: Automatically retrieves the JWT from `expo-secure-store` and attaches it as `Authorization: Bearer <token>`.
    - **Response**: Intercepts `401 Unauthorized` errors to trigger a global logout event and redirect to the Login screen.

### 5.2 Route Mapping (Restaurant Owner Endpoints)
| UI Screen | Action | API Endpoint | Method | Access |
|-----------|--------|--------------|--------|--------|
| Auth | Login | `/api/v1/auth/login` | POST | Public |
| Auth | Get Current User | `/api/v1/auth/me` | GET | Owner/Manager |
| Orders | List Orders | `/api/v1/orders` | GET | Owner/Manager |
| Orders | Get Order Detail | `/api/v1/orders/{id}` | GET | Owner/Manager |
| Orders | Update Status | `/api/v1/orders/{id}/status` | PATCH | Owner/Manager |
| Orders | Accept Order | `/api/v1/orders/{id}/accept` | POST | Owner/Manager |
| Orders | Prepare Order | `/api/v1/orders/{id}/prepare` | POST | Owner/Manager |
| Orders | Complete Order | `/api/v1/orders/{id}/complete` | POST | Owner/Manager |
| Menu | List Menu | `/api/v1/menu` | GET | Owner/Manager |
| Menu | Update Item | `/api/v1/menu/{id}` | PATCH | Owner/Manager |
| Menu | Toggle Availability | `/api/v1/menu/{id}/availability` | PATCH | Owner/Manager |
| Analytics | Sales Summary | `/api/v1/analytics/sales` | GET | Owner |
| Analytics | Popular Items | `/api/v1/analytics/popular` | GET | Owner |
| Profile | Update Profile | `/api/v1/profile` | PATCH | Owner/Manager |

---

## 6. Interaction Flow (Runtime View)

### 6.1 Order Acceptance Flow
1. **Notification**: Staff receives push notification (mocked) for new order.
2. **Review**: Staff opens `OrderDetailScreen` to review order items, delivery address, and special notes.
3. **Accept**: Staff taps "Accept Order" button → API call to `/api/v1/orders/{id}/accept`.
4. **Prepare**: Staff updates status to "Preparing" → API call to `/api/v1/orders/{id}/prepare`.
5. **Complete**: Staff marks order as "Ready" or "Completed" → API call to `/api/v1/orders/{id}/complete`.

### 6.2 Menu Update Flow
1. **View**: Staff opens `MenuScreen` to view all items and categories.
2. **Toggle Availability**: Staff toggles item availability → API call to `/api/v1/menu/{id}/availability`.
3. **Edit Price**: Staff taps item → Edit modal → Updates price → API call to `/api/v1/menu/{id}`.

### 6.3 Analytics View Flow
1. **Summary**: Staff opens `AnalyticsScreen` to view daily/weekly/monthly sales summary.
2. **Charts**: Revenue chart shows trends over selected period.
3. **Popular Items**: Top 10 items by quantity sold displayed with revenue.

---

## 7. Traceability Matrix

| Requirement ID | Design Element | Implementation Strategy |
|----------------|----------------|--------------------------|
| **UR-RO01** (Menu) | `features/menu` | Zustand store for local state → API PATCH for availability/price updates. |
| **UR-RO02** (Orders) | `features/orders` | Polling hook (10s interval) → Real-time status updates → API PATCH for status changes. |
| **UR-RO03** (Sales) | `features/analytics` | TanStack Query for cached data → Summary cards + charts → `/api/v1/analytics/sales`. |
| **BMR-001** (Multi-tenant) | `store/auth.ts` | JWT claims include `tenantId` → All API calls include `tenant_id` header. |
| **BOR-001** (PDPA) | `services/apiClient.ts` | JWT-based auth → RBAC middleware → No PII leakage across tenants. |
| **BOR-002** (Printer) | `features/orders` | Order status changes trigger printer relay (backend handles actual printing). |

---

## 8. Security Considerations

### 8.1 Authentication & Authorization
- **RBAC**: Restaurant Owner (owner/manager) roles enforced via JWT claims.
- **Tenant Isolation**: Every API call must include `tenant_id` in headers or JWT claims.
- **Session Management**: JWT stored in `expo-secure-store`, refreshed via `/api/v1/auth/refresh`.

### 8.2 Data Validation
- **Input Sanitization**: All user inputs validated on client and server.
- **Order Status Transitions**: Only valid transitions allowed (e.g., cannot skip from Pending to Completed).

### 8.3 Compliance
- **Australian PDPA**: PII (customer names, addresses, phones) handled per Privacy Act 1988.
- **Data Retention**: Analytics data aggregated and stored per tenant isolation requirements.

---

## 9. Development Notes

### 9.1 Mocked Backend Phase
During the Frontend-First implementation:
- All API calls use mocked doubles with hardcoded data.
- Real-time order updates simulated via polling with mock data refresh.
- Authentication uses mock JWT tokens (see `src/utils/mockAuth.ts`).

### 9.2 Future Backend Integration
When transitioning to real Rust/Axum backend:
- Replace mock API client with real `api-client` package.
- Implement WebSocket connections for real-time order notifications.
- Integrate with Stripe for payment verification (if restaurant needs payment status).

---

## 10. Appendices

### 10.1 Order Status State Machine
```
Pending → Accepted → Preparing → Ready → Completed
   ↓                                        ↓
 Cancelled                          Cancelled
```

### 10.2 Printer Integration Notes
- Restaurant App does NOT directly interface with printers.
- Order status changes trigger backend events → Printer Relay Service → Physical printer.
- App only needs to display order status, not handle printing.