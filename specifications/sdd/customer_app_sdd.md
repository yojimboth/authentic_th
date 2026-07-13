# Software Design Description (SDD): Customer Mobile App
**Project:** authentic_th  
**Standard:** ISO/IEC/IEEE 1016:2009 (Frontend/Mobile View)  
**Version:** 1.0  
**Status:** Draft  

---

## 1. Project Layout (Structure View)

The mobile application follows a **Feature-Based Architecture**. This approach ensures that as the app grows, related logic, components, and types remain co-located, reducing cognitive load and preventing the "folder sprawl" common in traditional layered architectures.

### 1.1 Directory Tree
```text
src/
├── assets/              # Static assets (fonts, images, svg)
├── components/          # Shared UI components (Atomic Design: atoms, molecules)
│   ├── common/          # Button, Input, Typography, Loader
│   └── layout/          # Screen wrappers, SafeAreaView configs
├── constants/           # Theme tokens, API endpoints, config
├── features/            # Domain-driven feature modules
│   ├── auth/            # Login, Registration, Password Reset
│   ├── menu/            # Product listing, Item details, Categories
│   ├── cart/            # Cart management, Order summary
│   ├── checkout/        # Stripe payment integration, Address selection
│   └── profile/         # User settings, Loyalty points, Order history
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
- **Internal access**: Components in `features/menu/components` can freely use hooks in `features/menu/hooks`.
- **Cross-feature access**: If the `checkout` feature needs `cart` data, it must go through the `store/` (Global State) or a defined service interface. This prevents circular dependencies.

---

## 2. Component Architecture (Composition View)

### 2.1 Presentational vs. Container Logic
The application employs a **Hook-Based Container Pattern**. Instead of wrapping components in "Container" classes, logic is extracted into custom hooks.

- **Presentational Components**: Pure functions that receive data via props and emit events via callbacks. They contain no business logic or API calls. (e.g., `FoodItemCard.tsx`)
- **Logic (Hooks)**: Custom hooks handle the "container" responsibility: fetching data, managing local state, and interacting with the global store. (e.g., `useMenu.ts`)

### 2.2 Key Component Tree
**Menu/Home Flow:**
`MainTabs` $\rightarrow$ `MenuScreen` $\rightarrow$ `CategoryFilter` $\rightarrow$ `FoodItemList` $\rightarrow$ `FoodItemCard` $\rightarrow$ `AddToCartButton`

**Checkout Flow:**
`CartScreen` $\rightarrow$ `OrderSummary` $\rightarrow$ `CheckoutButton` $\rightarrow$ `PaymentScreen (Stripe)` $\rightarrow$ `ConfirmationScreen`

### 2.3 UI Tokens (Styling)
Styling is implemented via **NativeWind (Tailwind CSS for React Native)** to ensure consistency across screens.
- **Colors**: Defined in `tailwind.config.js` using brand-spec tokens (e.g., `brand-primary`, `brand-accent`, `neutral-dark`).
- **Spacing**: Standardized scale (4px increments) to maintain alignment.
- **Typography**: Shared `Typography` component to wrap `Text` with predefined styles (`h1`, `body`, `caption`).

---

## 3. Type System (Logical View)

### 3.1 Key DTOs (Data Transfer Objects)
TypeScript interfaces are mirrored from the Rust/Axum backend structs to ensure type safety across the wire.

```typescript
// src/features/menu/types/index.ts
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  modifiers: ModifierOption[];
}

// src/features/cart/types/index.ts
export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  loyaltyDiscount: number;
}

// src/features/auth/types/index.ts
export interface UserSession {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    loyaltyPoints: number;
  };
}
```

### 3.2 UI State Handling
To eliminate "boolean soup" (e.g., `isLoading`, `isError`), the app uses **Discriminated Unions** for screen states.

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
- **Auth Store**: Manages `UserSession` and authentication status.
- **Cart Store**: Manages the current items in the cart, quantity updates, and temporary totals.

### 4.2 Server State (TanStack Query)
The application separates "Client State" from "Server State" using **React Query**.
- **Caching**: API responses (e.g., Menu items) are cached globally to prevent redundant network requests.
- **Mutations**: Used for actions like `updateCartItem` or `submitOrder`, providing optimistic updates for a snappy UI.
- **Polling**: Loyalty points are refreshed upon app foregrounding.

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

### 5.2 Route Mapping
| UI Screen | Action | API Endpoint (Overall SDD) | Method |
|-----------|--------|-----------------------------|--------|
| Menu | Fetch Menu | `/api/menu` | GET |
| Menu | Item Detail | `/api/menu/{id}` | GET |
| Cart | Update Qty | `/api/cart/items` | PATCH |
| Profile | Get User | `/api/user/profile` | GET |
| Checkout | Create Order| `/api/orders` | POST |
| Checkout | Pay | `/api/payments/stripe` | POST |

---

## 6. Interaction Flow (Runtime View)

### 6.1 Checkout Sequence
1. **Selection**: User triggers "Proceed to Checkout" in `CartScreen`.
2. **Validation**: `useCheckout` hook validates cart contents and user session via the Backend.
3. **Payment Intent**: App calls `/api/payments/stripe` to create a `PaymentIntent`.
4. **Stripe SDK**: The app initializes the **Stripe Mobile SDK** using the `client_secret` returned from the backend.
5. **Execution**: User enters card details $\rightarrow$ Stripe processes payment $\rightarrow$ Returns success/fail.
6. **Order Confirmation**: Upon Stripe success, the app calls `/api/orders/confirm` to finalize the order and clear the Zustand Cart Store.
7. **Completion**: User is redirected to `ConfirmationScreen`.

---

## 7. Traceability Matrix

| Requirement ID | Design Element | Implementation Strategy |
|----------------|----------------|--------------------------|
| **UR-C01** (Menu) | `features/menu` | TanStack Query for cached browsing $\rightarrow$ `FoodItem` DTO. |
| **UR-C02** (Cart) | `features/cart` | Zustand store for real-time sync; Axios PATCH for server persistence. |
| **UR-C03** (Pay) | `features/checkout`| Stripe SDK integration $\rightarrow$ `/api/payments/stripe` endpoint. |
| **UR-C04** (Loyalty)| `features/profile` | `UserSession` DTO $\rightarrow$ Read-only display in Profile UI. |
| **UR-C05** (Profile)| `features/auth` | `expo-secure-store` for JWT $\rightarrow` `/api/user/profile` for data. |
</task_result>
</task>