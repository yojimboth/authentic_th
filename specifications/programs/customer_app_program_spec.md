# Program Specification: Customer Mobile App
**Project**: authentic_th Food Ordering Ecosystem  
**Standard**: ISO/IEC/IEEE 1016:2009  
**Scope**: Frontend Program Logic for Customer App  
**Status**: Final Specification  
**Version**: 1.0

---

## 1. Architecture Overview

### 1.1 Tech Stack
- **Framework**: React Native 0.81.5 + Expo ~54.0.0
- **Language**: TypeScript 5.5+
- **Styling**: NativeWind v4 (Tailwind CSS for RN)
- **Navigation**: @react-navigation/native v6 + stack + tabs
- **State**: Zustand v4 (persistence via expo-secure-store)
- **API**: Custom ApiClient class (mock/in-memory, transitioning to Rust/Axum)

### 1.2 Directory Structure
```
src/
├── api/                    # ApiClient, interceptors, base API
├── assets/                 # Logos, icons, fonts
├── components/
│   ├── common/             # StoreLogo, Typography, GlobalSafeWrapper
│   └── ui/                 # Button, Input, Badge (future)
├── features/
│   ├── auth/               # Splash, AuthChoice, AuthScreen, ProfileCreation
│   ├── menu/               # MenuScreen, FoodItemCard, FoodItemDetail
│   ├── cart/               # CartScreen
│   ├── checkout/           # CheckoutScreen, ConfirmationScreen
│   ├── orders/             # OrderHistoryScreen, OrderStatusDetail
│   └── profile/            # ProfileScreen, EditProfileScreen
├── hooks/                  # useAuth, useMenu, useCart, useOrders, useProfile
├── store/                  # authStore, cartStore, orderStore, menuStore
├── types/                  # FoodItem, MenuCategory, UserProfile, etc.
├── utils/                  # mockAuth, auditLogger, formatCurrency
└── navigation/             # RootNavigator, MainTabsNavigator, types
```

### 1.3 Navigation Structure
```
Root Stack Navigator
├── Splash (1.5s auto-transition)
├── MainTabs (Bottom Tab Navigator)
│   ├── Menu (Utensils icon)
│   ├── Cart (Cart icon)
│   ├── Orders (Package icon)
│   └── Profile (User icon)
├── AuthChoice (stack, checkout flow)
├── Auth (email OTP flow)
├── ProfileCreation (new member setup)
├── FoodDetail (item detail)
├── Checkout (payment flow)
├── Confirmation (order success)
├── OrderStatusDetail (order tracking)
└── EditProfile (profile editing)
```

---

## 2. State Management

### 2.1 Auth Store (`authStore.ts`)
```typescript
interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isMember: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
  setGuest: () => void;
}
```

**Key Operations**:
- `initializeAuth()`: Check SecureStore for valid token on app launch
- `login()`: Email OTP flow (request code → verify code → complete profile if new)
- `logout()`: Clear SecureStore, reset state

**Persistence**: JWT stored in `expo-secure-store` with `ALWAYS_THIS_DEVICE_ONLY`

### 2.2 Cart Store (`cartStore.ts`)
```typescript
interface CartState {
  items: CartItem[];
  fulfillmentMethod: 'delivery' | 'pickup';
  addItem: (item: FoodItem, quantity?: number) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getFulfillmentFee: () => number;
}
```

**Constants**: `DELIVERY_FEE = 5.00`

**Calculations**:
- `total = sum(item.price * item.quantity)`
- `fulfillmentFee = fulfillmentMethod === 'delivery' ? 5.00 : 0`
- `finalTotal = total + fulfillmentFee`

### 2.3 Menu Store (`menuStore.ts`)
```typescript
interface MenuState {
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
  getCategoryById: (id: string) => MenuCategory | undefined;
}
```

**API Integration**:
- `GET /api/v1/menu` with `x-tenant-id` header
- Returns `MenuCategory[]` with items grouped by category

### 2.4 Order Store (`orderStore.ts`)
```typescript
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}
```

**WebSocket Integration**:
- Subscribe to `order:{id}` channel for real-time updates
- Update order status on `order_status_updated` event

---

## 3. API Contracts

### 3.1 Base Configuration
```typescript
const API_CONFIG = {
  baseURL: 'http://localhost:8113/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': 'tenant_siam_001', // From auth store
  },
};
```

### 3.2 Auth Endpoints

#### POST /api/v1/auth/request-code
```typescript
// Request
{ "email": "user@email.com" }

// Response (200)
{
  "status": "success",
  "data": {
    "message": "Verification code sent",
    "expiresIn": 300 // seconds
  }
}
```

#### POST /api/v1/auth/verify-code
```typescript
// Request
{ "email": "user@email.com", "code": "123456" }

// Response (200)
{
  "status": "success",
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "requiresProfile": false, // true if new user
    "user": { ... }
  }
}
```

#### POST /api/v1/auth/complete-profile
```typescript
// Request (requiresProfile = true)
{
  "name": "Liam Wilson",
  "phone": "0412345678",
  "email": "liam@email.com"
}

// Response (200)
{
  "status": "success",
  "data": {
    "user": { ... },
    "accessToken": "jwt_token_here"
  }
}
```

### 3.3 Menu Endpoints

#### GET /api/v1/menu
```typescript
// Headers
{ "x-tenant-id": "tenant_siam_001" }

// Response (200)
{
  "status": "success",
  "data": [
    {
      "id": "cat_001",
      "name": "Appetizers",
      "items": [
        {
          "id": "item_001",
          "name": "Spring Rolls",
          "description": "Crispy vegetable spring rolls",
          "price": 8.90,
          "image": "https://...",
          "spice": 0,
          "isAvailable": true
        }
      ]
    }
  ]
}
```

### 3.4 Payment Endpoints

#### POST /api/v1/payments/stripe
```typescript
// Request
{
  "items": [
    { "itemId": "item_001", "quantity": 2, "selectedModifiers": [] }
  ],
  "fulfillment": "delivery",
  "address": "123 George St, Sydney NSW 2000",
  "useLoyaltyPoints": true,
  "loyaltyPoints": 100
}

// Response (200)
{
  "status": "success",
  "data": {
    "paymentIntentId": "pi_xxx",
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 41.00,
    "currency": "AUD"
  }
}
```

**Security**:
- Cart total NOT sent to backend (backend calculates)
- Client-side price verification (1-cent tolerance)
- Max amount guard ($10,000)
- Only IDs and quantities sent (not full cart data)

### 3.5 Order Endpoints

#### POST /api/v1/orders/confirm
```typescript
// Request (after successful payment)
{
  "items": [
    { "itemId": "item_001", "quantity": 2, "selectedModifiers": [] }
  ],
  "fulfillment": "delivery",
  "address": "123 George St, Sydney NSW 2000"
}

// Response (200)
{
  "status": "success",
  "data": {
    "orderId": "ord_xxx",
    "estimatedDelivery": "25-30 min",
    "status": "Paid"
  }
}
```

#### GET /api/v1/orders/{id}
```typescript
// Response (200)
{
  "status": "success",
  "data": {
    "id": "ord_xxx",
    "status": "Preparing",
    "items": [...],
    "total": 41.00,
    "estimatedDelivery": "15 min",
    "createdAt": "2024-07-20T10:00:00Z"
  }
}
```

#### WebSocket: `order:{id}`
```typescript
// Event: order_status_updated
{
  "orderId": "ord_xxx",
  "status": "Preparing",
  "timestamp": "2024-07-20T10:05:00Z"
}
```

---

## 4. Screen Implementations

### 4.1 Splash Screen
**File**: `src/features/auth/components/SplashScreen.tsx`

**Logic**:
```typescript
export function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // Navigate to MainTabs or Login
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Render logo, name, slogan, ActivityIndicator
}
```

**Dependencies**: `useAuthStore.initializeAuth()` called in background

---

### 4.2 AuthChoice Screen
**File**: `src/features/auth/screens/AuthChoiceScreen.tsx`

**Props**: `onReturnToCheckout: () => void`

**Logic**:
```typescript
const handleGuest = () => {
  authStore.setGuest();
  onReturnToCheckout();
};

const handleMember = () => {
  navigation.navigate('Auth', { onReturnToCheckout });
};
```

---

### 4.3 Auth Screen (Email OTP)
**File**: `src/features/auth/screens/AuthScreen.tsx`

**States**: `email` | `code` | `loading` | `error` | `countdown`

**Logic**:
```typescript
const handleEmailSubmit = async () => {
  if (!validateEmail(email)) return;
  setLoading(true);
  const result = await authStore.requestCode(email);
  if (result.success) {
    setStep('code');
    startCountdown(300);
  }
  setLoading(false);
};

const handleCodeSubmit = async () => {
  if (code.length !== 6 || !/^\d+$/.test(code)) return;
  setLoading(true);
  const result = await authStore.verifyCode(email, code);
  if (result.success) {
    if (result.requiresProfile) {
      navigation.navigate('ProfileCreation', { email, onReturnToCheckout });
    } else {
      onReturnToCheckout();
    }
  }
  setLoading(false);
};
```

**Validation**:
- Email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Code: Exactly 6 digits
- Resend cooldown: 300 seconds

---

### 4.4 Profile Creation Screen
**File**: `src/features/auth/screens/ProfileCreationScreen.tsx`

**Props**: `email: string`, `onReturnToCheckout: () => void`

**Logic**:
```typescript
const handleContinue = async () => {
  if (!validateName(name)) return;
  if (!validatePhone(phone)) return;
  setLoading(true);
  const result = await authStore.completeProfile({ name, phone, email });
  if (result.success) {
    onReturnToCheckout();
  }
  setLoading(false);
};
```

**Validation**:
- Name: 2-60 characters
- Phone: `/^04\d{8}$/` (Australian mobile)
- Auto-format: `04XX XXX XXX`

---

### 4.5 Menu Screen
**File**: `src/features/menu/screens/MenuScreen.tsx`

**Hooks**: `useMenu()` → `GET /api/v1/menu`

**Logic**:
```typescript
export function useMenu() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['menu'],
    queryFn: () => apiClient.get('/menu'),
  });
  return { categories: data, isLoading, error };
}

const handleCategoryPress = (categoryId: string) => {
  const offset = categoryOffsets[categoryId];
  menuScrollRef.current?.scrollToOffset({ offset, animated: true });
};

const handleItemPress = (item: FoodItem) => {
  // Add to cart or navigate to detail
  cartStore.addItem(item);
};
```

**Category Navigation**: Track Y-offsets via `onLayout` for smooth scrolling

---

### 4.6 Cart Screen
**File**: `src/features/cart/components/CartScreen.tsx`

**Hooks**: `useCartStore()`

**Logic**:
```typescript
const fulfillment = useCartStore(s => s.fulfillmentMethod);
const items = useCartStore(s => s.items);
const updateQuantity = useCartStore(s => s.updateQuantity);
const removeItem = useCartStore(s => s.removeItem);

const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const deliveryFee = fulfillment === 'delivery' ? 5.00 : 0;
const total = subtotal + deliveryFee;

const handleCheckout = () => {
  navigation.navigate('Checkout');
};

const handleBrowseMenu = () => {
  navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
};
```

**Empty State**: Show "Browse Menu" button if no items

---

### 4.7 Checkout Screen
**File**: `src/features/checkout/screens/CheckoutScreen.tsx`

**Logic**:
```typescript
const handlePayment = async () => {
  // Check auth status
  if (!authStore.isAuthenticated && !authStore.isGuest) {
    navigation.navigate('AuthChoice', { onReturnToCheckout: handlePayment });
    return;
  }
  
  setLoading(true);
  try {
    // Create payment intent
    const paymentResult = await apiClient.post('/payments/stripe', {
      items: items.map(i => ({ itemId: i.id, quantity: i.quantity })),
      fulfillment: fulfillment,
      address: fulfillment === 'delivery' ? address : undefined,
      useLoyaltyPoints,
      loyaltyPoints: authStore.user?.loyaltyPoints || 0,
    });
    
    // Verify price (1-cent tolerance)
    if (Math.abs(paymentResult.amount - expectedTotal) > 0.01) {
      Alert.alert('Error', 'Price mismatch');
      return;
    }
    
    // Process Stripe payment (mock: 1.5s delay)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Confirm order
    const orderResult = await apiClient.post('/orders/confirm', {
      items: items.map(i => ({ itemId: i.id, quantity: i.quantity })),
      fulfillment: fulfillment,
      address: fulfillment === 'delivery' ? address : undefined,
    });
    
    // Clear cart and show confirmation
    cartStore.clearCart();
    Alert.alert('Order Placed!', `Order #${orderResult.orderId}`);
    onPaymentSuccess();
  } catch (error) {
    Alert.alert('Payment Failed', 'Please try again');
  }
  setLoading(false);
};
```

**Loyalty Calculation**:
```typescript
const maxLoyaltyDiscount = (loyaltyPoints || 0) * 0.05; // 100 pts = $5
const loyaltyDiscount = useLoyaltyPoints ? Math.min(maxLoyaltyDiscount, total) : 0;
const finalTotal = total - loyaltyDiscount;
const pointsToEarn = Math.floor(finalTotal);
```

---

### 4.8 Confirmation Screen
**File**: `src/features/checkout/screens/ConfirmationScreen.tsx`

**Props**: `orderId: string`

**Logic**:
```typescript
const handleTrackOrder = () => {
  navigation.navigate('OrderStatusDetail', { orderId });
};

const handleBackToHome = () => {
  navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
};
```

---

### 4.9 Order Status Detail Screen
**File**: `src/features/orders/screens/OrderStatusDetailScreen.tsx`

**Hooks**: `useOrder(orderId)`

**Logic**:
```typescript
const { data: order, isLoading } = useQuery({
  queryKey: ['order', orderId],
  queryFn: () => apiClient.get(`/orders/${orderId}`),
});

// WebSocket subscription
useEffect(() => {
  const ws = new WebSocket(`wss://api.example.com/ws/order/${orderId}`);
  ws.onmessage = (event) => {
    const { status } = JSON.parse(event.data);
    if (status) {
      // Update order status
    }
  };
  return () => ws.close();
}, [orderId]);
```

**Status Stepper**: `[Paid] → [Preparing] → [Ready] → [Completed]`

---

## 5. Security Considerations

### 5.1 Authentication
- Passwordless email OTP (no passwords stored)
- JWT tokens in `expo-secure-store` (not AsyncStorage)
- Token refresh via `/auth/refresh` on 401
- Session timeout: 24 hours

### 5.2 Payment Security
- No credit card data handled by backend
- Stripe Elements/Checkout for card entry
- Client-side price verification before confirmation
- Max order amount: $10,000

### 5.3 Data Protection (PDPA)
- PII (name, phone, address) encrypted at rest
- Right to access: `GET /api/v1/user/data`
- Right to be forgotten: `DELETE /api/v1/user/profile`
- Audit logging for all data access

### 5.4 Input Validation
- Email: RFC 5322 simplified regex
- Phone: Australian mobile format
- Price: Numeric with 2 decimal places
- Quantity: Integer ≥ 1

---

## 6. Error Handling

### 6.1 Network Errors
```typescript
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.logout();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
    if (error.code === 'ECONNABORTED') {
      showToast('Network timeout. Please try again.');
    }
    return Promise.reject(error);
  }
);
```

### 6.2 Validation Errors
- Inline field-level messages (red text below input)
- Form submission: Show all errors at once
- Clear error recovery (tap field to dismiss)

### 6.3 Payment Errors
- Generic message: "Payment failed. Please try another card."
- No internal error details exposed
- Stay on checkout screen for retry

---

## 7. Testing Strategy

### 7.1 Unit Tests
- Store logic (authStore, cartStore, menuStore, orderStore)
- Utility functions (formatCurrency, validateEmail, etc.)
- Hook logic (useMenu, useCart, etc.)

### 7.2 Component Tests
- Render tests for all screens
- Interaction tests (button press, input change)
- State transition tests (loading → success/error)

### 7.3 Integration Tests
- Auth flow (email → code → profile → checkout)
- Cart flow (add → update → remove → checkout)
- Order flow (place → track → status update)

### 7.4 E2E Tests (Future)
- Playwright for web testing
- Detox for mobile testing

---

## 8. Traceability Matrix

| Requirement | Screen | Hook/Store | API Endpoint |
|------------|--------|------------|--------------|
| **UR-C01** (Browse Menu) | MenuScreen | useMenu | GET /menu |
| **UR-C02** (Place Order) | CheckoutScreen, ConfirmationScreen | useCartStore, useOrder | POST /payments/stripe, POST /orders/confirm |
| **UR-C03** (Loyalty Points) | ProfileScreen, CheckoutScreen | useAuthStore | GET /user/profile |
| **UR-C04** (Manage Profile) | ProfileScreen, EditProfileScreen | useProfile | PATCH /user/profile |
| **UR-C05** (Guest Checkout) | AuthChoiceScreen, CheckoutScreen | useAuthStore | N/A (local state) |

---

**This specification is binding for all Customer App implementation. No deviations without explicit approval from the project owner.**