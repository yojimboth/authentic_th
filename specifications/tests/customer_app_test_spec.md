# Test Specification: Customer Mobile App
**Project**: authentic_th Food Ordering Ecosystem  
**Standard**: ISO/IEC/IEEE 29119:2013  
**Scope**: Test Cases for Customer App  
**Status**: Final Specification  
**Version**: 1.0

---

## 1. Test Strategy

### 1.1 Testing Levels
- **Unit Tests**: Components, hooks, stores, utilities
- **Integration Tests**: Feature flows (auth, cart, checkout)
- **E2E Tests** (Future): Full user journeys

### 1.2 Test Tools
- **Framework**: Jest + React Native Testing Library
- **Mocking**: MSW (Mock Service Worker) for API
- **Coverage Target**: 80%+

### 1.3 Test Naming Convention
- Unit: `{feature}.test.ts` (e.g., `authStore.test.ts`)
- Component: `{ScreenName}.test.tsx` (e.g., `MenuScreen.test.tsx`)
- Integration: `{flow}-flow.test.tsx` (e.g., `checkout-flow.test.tsx`)

---

## 2. Traceability Matrix

| Requirement | Test ID | Test Name | Level | Priority |
|------------|---------|-----------|-------|----------|
| **UR-C01** (Browse Menu) | TC-MENU-001 | Menu loads with categories | Unit | High |
| **UR-C01** (Browse Menu) | TC-MENU-002 | Category navigation works | Integration | High |
| **UR-C01** (Browse Menu) | TC-MENU-003 | FoodItemCard renders correctly | Unit | Medium |
| **UR-C02** (Place Order) | TC-CART-001 | Add item to cart | Integration | High |
| **UR-C02** (Place Order) | TC-CART-002 | Update quantity | Integration | High |
| **UR-C02** (Place Order) | TC-CART-003 | Remove item from cart | Integration | High |
| **UR-C02** (Place Order) | TC-CHECKOUT-001 | Checkout calculates totals | Integration | High |
| **UR-C02** (Place Order) | TC-CHECKOUT-002 | Payment flow succeeds | Integration | Critical |
| **UR-C02** (Place Order) | TC-CHECKOUT-003 | Loyalty points applied | Integration | Medium |
| **UR-C03** (Loyalty Points) | TC-LOYALTY-001 | Points displayed correctly | Unit | Medium |
| **UR-C04** (Manage Profile) | TC-PROFILE-001 | Profile loads correctly | Unit | Medium |
| **UR-C05** (Guest Checkout) | TC-AUTH-001 | Guest checkout flow works | Integration | High |

---

## 3. Unit Test Specifications

### 3.1 Auth Store (`authStore.test.ts`)

**TC-AUTH-001: Initialize with no auth**
```typescript
it('should initialize with isAuthenticated: false', () => {
  const state = useAuthStore.getState();
  expect(state.isAuthenticated).toBe(false);
  expect(state.user).toBeNull();
});
```

**TC-AUTH-002: Login with valid credentials**
```typescript
it('should login with valid email and password', async () => {
  const result = await useAuthStore.getState().login('founder@test.com', 'password123');
  expect(result.success).toBe(true);
  expect(useAuthStore.getState().isAuthenticated).toBe(true);
});
```

**TC-AUTH-003: Login with invalid credentials**
```typescript
it('should fail login with invalid password', async () => {
  const result = await useAuthStore.getState().login('founder@test.com', 'wrong');
  expect(result.success).toBe(false);
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
});
```

**TC-AUTH-004: Logout**
```typescript
it('should logout and clear state', () => {
  useAuthStore.getState().login('founder@test.com', 'password123');
  useAuthStore.getState().logout();
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
  expect(useAuthStore.getState().user).toBeNull();
});
```

**TC-AUTH-005: Set guest mode**
```typescript
it('should set guest mode', () => {
  useAuthStore.getState().setGuest();
  expect(useAuthStore.getState().isGuest).toBe(true);
  expect(useAuthStore.getState().isMember).toBe(false);
});
```

---

### 3.2 Cart Store (`cartStore.test.ts`)

**TC-CART-001: Add item to cart**
```typescript
it('should add item to cart', () => {
  const item: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  useCartStore.getState().addItem(item);
  expect(useCartStore.getState().items).toHaveLength(1);
  expect(useCartStore.getState().items[0].name).toBe('Pad Thai');
});
```

**TC-CART-002: Update quantity**
```typescript
it('should update item quantity', () => {
  const item: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  useCartStore.getState().addItem(item);
  useCartStore.getState().updateQuantity('1', 2);
  expect(useCartStore.getState().items[0].quantity).toBe(3); // 1 + 2
});
```

**TC-CART-003: Remove item from cart**
```typescript
it('should remove item from cart', () => {
  const item: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  useCartStore.getState().addItem(item);
  useCartStore.getState().removeItem('1');
  expect(useCartStore.getState().items).toHaveLength(0);
});
```

**TC-CART-004: Calculate total**
```typescript
it('should calculate cart total correctly', () => {
  const item1: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  const item2: FoodItem = { id: '2', name: 'Spring Rolls', price: 8.90 };
  useCartStore.getState().addItem(item1);
  useCartStore.getState().addItem(item2);
  expect(useCartStore.getState().getTotal()).toBeCloseTo(24.80);
});
```

**TC-CART-005: Calculate with delivery fee**
```typescript
it('should add delivery fee when delivery selected', () => {
  useCartStore.getState().setFulfillmentMethod('delivery');
  const item: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  useCartStore.getState().addItem(item);
  expect(useCartStore.getState().getTotal()).toBeCloseTo(20.90); // 15.90 + 5.00
});
```

---

### 3.3 Menu Store (`menuStore.test.ts`)

**TC-MENU-001: Fetch menu categories**
```typescript
it('should fetch menu categories', async () => {
  const { result } = renderHook(() => useMenu());
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.categories).toBeDefined();
  expect(result.current.categories.length).toBeGreaterThan(0);
});
```

**TC-MENU-002: Get category by ID**
```typescript
it('should get category by ID', () => {
  const category = useMenuStore.getState().getCategoryById('cat_001');
  expect(category).toBeDefined();
  expect(category.name).toBe('Appetizers');
});
```

---

### 3.4 Utilities (`utils/*.test.ts`)

**TC-UTIL-001: Format currency**
```typescript
it('should format currency correctly', () => {
  expect(formatCurrency(15.9)).toBe('$15.90');
  expect(formatCurrency(100)).toBe('$100.00');
  expect(formatCurrency(0)).toBe('$0.00');
});
```

**TC-UTIL-002: Validate email**
```typescript
it('should validate email format', () => {
  expect(validateEmail('test@test.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
  expect(validateEmail('')).toBe(false);
});
```

**TC-UTIL-003: Validate phone**
```typescript
it('should validate Australian phone', () => {
  expect(validatePhone('0412345678')).toBe(true);
  expect(validatePhone('0412 345 678')).toBe(true);
  expect(validatePhone('12345')).toBe(false);
});
```

---

## 4. Component Test Specifications

### 4.1 LoginScreen (`LoginScreen.test.tsx`)

**TC-COMP-001: Render email and password fields**
```typescript
it('should render email and password inputs', () => {
  render(<LoginScreen navigation={mockNavigation} />);
  expect(screen.getByPlaceholderText('your@email.com')).toBeTruthy();
  expect(screen.getByPlaceholderText('Enter password')).toBeTruthy();
});
```

**TC-COMP-002: Show validation error for invalid email**
```typescript
it('should show email validation error', async () => {
  render(<LoginScreen navigation={mockNavigation} />);
  const emailInput = screen.getByPlaceholderText('your@email.com');
  const passwordInput = screen.getByPlaceholderText('Enter password');
  const loginButton = screen.getByText('Sign In');
  
  fireEvent.changeText(emailInput, 'invalid');
  fireEvent.changeText(passwordInput, 'password123');
  fireEvent.press(loginButton);
  
  await waitFor(() => {
    expect(screen.getByText('Please enter a valid email')).toBeTruthy();
  });
});
```

**TC-COMP-003: Show validation error for short password**
```typescript
it('should show password validation error', async () => {
  render(<LoginScreen navigation={mockNavigation} />);
  const emailInput = screen.getByPlaceholderText('your@email.com');
  const passwordInput = screen.getByPlaceholderText('Enter password');
  const loginButton = screen.getByText('Sign In');
  
  fireEvent.changeText(emailInput, 'test@test.com');
  fireEvent.changeText(passwordInput, 'short');
  fireEvent.press(loginButton);
  
  await waitFor(() => {
    expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
  });
});
```

**TC-COMP-004: Navigate to MainTabs on success**
```typescript
it('should navigate to MainTabs on successful login', async () => {
  render(<LoginScreen navigation={mockNavigation} />);
  const emailInput = screen.getByPlaceholderText('your@email.com');
  const passwordInput = screen.getByPlaceholderText('Enter password');
  const loginButton = screen.getByText('Sign In');
  
  fireEvent.changeText(emailInput, 'founder@authentic.com');
  fireEvent.changeText(passwordInput, 'password123');
  fireEvent.press(loginButton);
  
  await waitFor(() => {
    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  });
});
```

---

### 4.2 MenuScreen (`MenuScreen.test.tsx`)

**TC-COMP-005: Render menu categories**
```typescript
it('should render menu categories', async () => {
  render(<MenuScreen navigation={mockNavigation} />);
  await waitFor(() => {
    expect(screen.getByText('Appetizers')).toBeTruthy();
  });
});
```

**TC-COMP-006: Render food items**
```typescript
it('should render food items for each category', async () => {
  render(<MenuScreen navigation={mockNavigation} />);
  await waitFor(() => {
    expect(screen.getByText('Spring Rolls')).toBeTruthy();
  });
});
```

---

### 4.3 CartScreen (`CartScreen.test.tsx`)

**TC-COMP-007: Show empty cart message**
```typescript
it('should show empty cart message when no items', () => {
  render(<CartScreen navigation={mockNavigation} />);
  expect(screen.getByText('Your cart is empty')).toBeTruthy();
});
```

**TC-COMP-008: Render cart items**
```typescript
it('should render cart items when items exist', async () => {
  const item: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  useCartStore.getState().addItem(item);
  render(<CartScreen navigation={mockNavigation} />);
  expect(screen.getByText('Pad Thai')).toBeTruthy();
});
```

---

### 4.4 CheckoutScreen (`CheckoutScreen.test.tsx`)

**TC-COMP-009: Show order summary**
```typescript
it('should show order summary with items', async () => {
  const item: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  useCartStore.getState().addItem(item);
  render(<CheckoutScreen navigation={mockNavigation} />);
  expect(screen.getByText('Pad Thai')).toBeTruthy();
});
```

**TC-COMP-010: Calculate totals correctly**
```typescript
it('should calculate correct total with delivery fee', async () => {
  const item: FoodItem = { id: '1', name: 'Pad Thai', price: 15.90 };
  useCartStore.getState().setFulfillmentMethod('delivery');
  useCartStore.getState().addItem(item);
  render(<CheckoutScreen navigation={mockNavigation} />);
  expect(screen.getByText('$20.90')).toBeTruthy();
});
```

---

## 5. Integration Test Specifications

### 5.1 Auth Flow (`auth-flow.test.tsx`)

**TC-FLOW-001: Complete auth flow**
```typescript
it('should complete full auth flow', async () => {
  // 1. Show splash
  render(<App />);
  await waitFor(() => expect(screen.getByText('Restaurant Manager')).toBeTruthy());
  
  // 2. Navigate to login
  await waitFor(() => expect(screen.getByText('Sign In')).toBeTruthy());
  
  // 3. Enter credentials
  fireEvent.changeText(screen.getByPlaceholderText('your@email.com'), 'founder@authentic.com');
  fireEvent.changeText(screen.getByPlaceholderText('Enter password'), 'password123');
  
  // 4. Click login
  fireEvent.press(screen.getByText('Sign In'));
  
  // 5. Should navigate to MainTabs
  await waitFor(() => {
    expect(screen.getByText('My Orders')).toBeTruthy();
  });
});
```

### 5.2 Cart Flow (`cart-flow.test.tsx`)

**TC-FLOW-002: Add item and checkout**
```typescript
it('should add item to cart and proceed to checkout', async () => {
  render(<App />);
  
  // Navigate to menu
  await waitFor(() => expect(screen.getByText('Spring Rolls')).toBeTruthy());
  
  // Add item to cart
  fireEvent.press(screen.getByText('Add to Order'));
  
  // Navigate to cart
  await waitFor(() => expect(screen.getByText('Your Order')).toBeTruthy());
  
  // Proceed to checkout
  fireEvent.press(screen.getByText('Proceed to Checkout'));
  
  // Should be on checkout screen
  await waitFor(() => {
    expect(screen.getByText('Pay')).toBeTruthy();
  });
});
```

### 5.3 Checkout Flow (`checkout-flow.test.tsx`)

**TC-FLOW-003: Complete checkout**
```typescript
it('should complete checkout flow', async () => {
  render(<App />);
  
  // Add item to cart
  fireEvent.press(screen.getByText('Add to Order'));
  fireEvent.press(screen.getByText('Proceed to Checkout'));
  
  // Click pay
  fireEvent.press(screen.getByText('Pay'));
  
  // Should show confirmation
  await waitFor(() => {
    expect(screen.getByText('Order Confirmed')).toBeTruthy();
  });
});
```

---

## 6. Edge Case Test Specifications

### 6.1 Network Errors

**TC-EDGE-001: Handle network error on login**
```typescript
it('should show error on network failure', async () => {
  // Mock API failure
  mockApi.post('/auth/login').reply(500);
  
  render(<LoginScreen navigation={mockNavigation} />);
  fireEvent.changeText(screen.getByPlaceholderText('your@email.com'), 'test@test.com');
  fireEvent.changeText(screen.getByPlaceholderText('Enter password'), 'password123');
  fireEvent.press(screen.getByText('Sign In'));
  
  await waitFor(() => {
    expect(screen.getByText(/Failed to login/i)).toBeTruthy();
  });
});
```

### 6.2 Empty States

**TC-EDGE-002: Show empty menu state**
```typescript
it('should show empty state when no menu items', async () => {
  // Mock empty menu
  mockApi.get('/menu').reply(200, []);
  
  render(<MenuScreen navigation={mockNavigation} />);
  await waitFor(() => {
    expect(screen.getByText(/No items available/i)).toBeTruthy();
  });
});
```

### 6.3 Form Validation

**TC-EDGE-003: Prevent form submission with invalid data**
```typescript
it('should prevent login with empty fields', async () => {
  render(<LoginScreen navigation={mockNavigation} />);
  fireEvent.press(screen.getByText('Sign In'));
  
  // Should show validation errors
  await waitFor(() => {
    expect(screen.getByText(/Email is required/i)).toBeTruthy();
  });
});
```

---

## 7. Performance Test Specifications

### 7.1 Render Performance

**TC-PERF-001: Menu screen render time**
```typescript
it('should render menu in under 200ms', () => {
  const start = performance.now();
  render(<MenuScreen navigation={mockNavigation} />);
  const end = performance.now();
  expect(end - start).toBeLessThan(200);
});
```

### 7.2 Cart Operations

**TC-PERF-002: Cart operations should be instant**
```typescript
it('should update cart quantity instantly', () => {
  const start = performance.now();
  useCartStore.getState().updateQuantity('1', 1);
  const end = performance.now();
  expect(end - start).toBeLessThan(10); // 10ms
});
```

---

## 8. Test Data

### 8.1 Mock Users
```typescript
const MOCK_USERS = [
  { email: 'founder@authentic.com', password: 'password123', role: 'FOUNDER' },
  { email: 'cofounder@authentic.com', password: 'password123', role: 'CO_FOUNDER' },
];
```

### 8.2 Mock Menu Items
```typescript
const MOCK_MENU = [
  { id: '1', name: 'Spring Rolls', price: 8.90, category: 'Appetizers' },
  { id: '2', name: 'Pad Thai', price: 15.90, category: 'Noodles' },
  { id: '3', name: 'Tom Yum Soup', price: 13.50, category: 'Soups' },
];
```

### 8.3 Mock Cart Items
```typescript
const MOCK_CART_ITEMS = [
  { id: '1', name: 'Pad Thai', price: 15.90, quantity: 2 },
  { id: '2', name: 'Spring Rolls', price: 8.90, quantity: 1 },
];
```

---

## 9. Test Execution

### 9.1 Run All Tests
```bash
npm test
```

### 9.2 Run Specific Test Suite
```bash
npm test -- authStore.test.ts
npm test -- MenuScreen.test.tsx
```

### 9.3 Run with Coverage
```bash
npm test -- --coverage
```

### 9.4 Watch Mode
```bash
npm test -- --watch
```

---

## 10. Test Maintenance

### 10.1 When to Update Tests
- New feature added
- Existing feature modified
- Bug fix that changes behavior
- UI/UX changes

### 10.2 Test Documentation
- Each test should have a clear description
- Mock setup should be documented
- Edge cases should be explicitly tested

### 10.3 Code Coverage Goals
- **Unit Tests**: 80%+
- **Component Tests**: 70%+
- **Integration Tests**: 60%+

---

**This specification is binding for all Customer App testing. Test cases must be created and maintained according to this document.**