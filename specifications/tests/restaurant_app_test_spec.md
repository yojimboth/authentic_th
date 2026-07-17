# Test Specification: Restaurant Mobile App
**Project:** authentic_th  
**Version:** 1.0  
**Status:** Draft  
**Traceability:** BRD UR-RO01, UR-RO02, UR-RO03 | SDD | Program Specifications

---

## 1. Test Strategy

### 1.1 Testing Levels
1. **Unit Tests**: Test individual functions, hooks, and components
2. **Integration Tests**: Test component interactions and API mocking
3. **End-to-End (E2E) Tests**: Test complete user flows

### 1.2 Testing Tools
- **Jest**: Unit and integration testing framework
- **React Native Testing Library**: Component testing utilities
- **Mock Service Worker (MSW)**: API mocking (optional for future)

### 1.3 Test Coverage Requirements
- **Unit Tests**: 80% minimum coverage for hooks and utilities
- **Integration Tests**: All critical user flows
- **E2E Tests**: Core workflows (login, order acceptance, menu updates)

---

## 2. Test Traceability Matrix

| Requirement ID | Test Case ID | Test Description | Level | Priority |
|----------------|--------------|------------------|-------|----------|
| UR-RO01 | TC-MENU-001 | Display menu items correctly | Unit | High |
| UR-RO01 | TC-MENU-002 | Toggle item availability | Integration | High |
| UR-RO01 | TC-MENU-003 | Update menu item price | Integration | High |
| UR-RO02 | TC-ORD-001 | Display order list | Unit | High |
| UR-RO02 | TC-ORD-002 | Accept pending order | Integration | High |
| UR-RO02 | TC-ORD-003 | Prepare accepted order | Integration | High |
| UR-RO02 | TC-ORD-004 | Complete order | Integration | High |
| UR-RO02 | TC-ORD-005 | Filter orders by status | Unit | Medium |
| UR-RO03 | TC-ANAL-001 | Display sales summary | Unit | Medium |
| UR-RO03 | TC-ANAL-002 | Display popular items | Unit | Medium |
| BOR-001 | TC-AUTH-001 | Login with valid credentials | Integration | High |
| BOR-001 | TC-AUTH-002 | Login with invalid credentials | Integration | High |
| BOR-001 | TC-AUTH-003 | Session persistence | Integration | High |

---

## 3. Unit Test Specifications

### 3.1 Auth Hook Tests

#### TC-AUTH-001: Login with Valid Credentials
**Given**: User enters valid email and password  
**When**: User taps "Sign In" button  
**Then**: 
- API call is made to `/auth/login`
- Token is stored in auth store
- User is redirected to MainTabs
- Loading state is cleared

```typescript
// Test structure
it('should login successfully with valid credentials', async () => {
  // Mock API response
  mockApi.post('/auth/login').reply(200, {
    status: 'success',
    data: {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      user: { id: 'usr_1', email: 'test@test.com', fullName: 'Test User', role: 'owner', tenantId: 'tenant_1' }
    }
  });

  // Render component
  render(<LoginScreen navigation={mockNavigation} />);
  
  // Fill form
  await userEvent.type(emailInput, 'test@test.com');
  await userEvent.type(passwordInput, 'password123');
  
  // Tap login button
  await userEvent.tap(loginButton);
  
  // Wait for API call
  await waitFor(() => expect(mockApi.history.post.length).toBeGreaterThan(0));
  
  // Verify navigation
  expect(mockNavigation.reset).toHaveBeenCalledWith({
    index: 0,
    routes: [{ name: 'MainTabs' }],
  });
});
```

#### TC-AUTH-002: Login with Invalid Credentials
**Given**: User enters invalid email and password  
**When**: User taps "Sign In" button  
**Then**:
- API call is made to `/auth/login`
- Error message is displayed
- User remains on login screen

```typescript
it('should display error for invalid credentials', async () => {
  // Mock API error response
  mockApi.post('/auth/login').reply(401, {
    status: 'error',
    error: { code: 'AUTH_001', message: 'Invalid email or password' }
  });

  render(<LoginScreen navigation={mockNavigation} />);
  
  // Fill form with invalid credentials
  await userEvent.type(emailInput, 'invalid@test.com');
  await userEvent.type(passwordInput, 'wrongpass');
  
  // Tap login button
  await userEvent.tap(loginButton);
  
  // Wait for error
  await waitFor(() => expect(screen.getByText('Invalid email or password')).toBeTruthy());
});
```

---

### 3.2 Order Hook Tests

#### TC-ORD-001: Display Order List
**Given**: Orders exist in the store  
**When**: OrdersScreen is rendered  
**Then**:
- All orders are displayed
- Order cards show correct status badges
- Order amounts are formatted correctly

```typescript
it('should display all orders correctly', () => {
  const mockOrders = [
    { id: 'ord_1', status: 'Pending', total: 45.50, items: [{ name: 'Pad Thai', quantity: 2 }] },
    { id: 'ord_2', status: 'Accepted', total: 32.00, items: [{ name: 'Tom Yum', quantity: 1 }] },
  ];
  
  useOrderStore.getState().setOrders(mockOrders);
  
  render(<OrdersScreen navigation={mockNavigation} />);
  
  // Verify orders are displayed
  expect(screen.getByText('ORD-1')).toBeTruthy();
  expect(screen.getByText('ORD-2')).toBeTruthy();
  
  // Verify status badges
  expect(screen.getByText('Pending')).toBeTruthy();
  expect(screen.getByText('Accepted')).toBeTruthy();
  
  // Verify amounts
  expect(screen.getByText('$45.50')).toBeTruthy();
  expect(screen.getByText('$32.00')).toBeTruthy();
});
```

#### TC-ORD-002: Accept Pending Order
**Given**: An order with status "Pending" is displayed  
**When**: User taps "Accept" button and confirms  
**Then**:
- Confirmation dialog is shown
- API call to `/orders/{id}/accept` is made
- Order status updates to "Accepted"
- Success alert is displayed

```typescript
it('should accept a pending order', async () => {
  const mockOrder = { id: 'ord_1', status: 'Pending', total: 45.50 };
  useOrderStore.getState().setOrders([mockOrder]);
  
  mockApi.post('/orders/ord_1/accept').reply(200, {
    status: 'success',
    data: { id: 'ord_1', status: 'Accepted' }
  });
  
  render(<OrdersScreen navigation={mockNavigation} />);
  
  // Tap accept button
  await userEvent.tap(screen.getByText('Accept'));
  
  // Confirm dialog
  await userEvent.tap(screen.getByText('Confirm'));
  
  // Wait for API call
  await waitFor(() => expect(mockApi.history.post.length).toBeGreaterThan(0));
  
  // Verify order status updated
  expect(useOrderStore.getState().orders[0].status).toBe('Accepted');
});
```

---

### 3.3 Menu Hook Tests

#### TC-MENU-001: Display Menu Items
**Given**: Menu categories and items exist in the store  
**When**: MenuScreen is rendered  
**Then**:
- All categories are displayed
- All items within categories are displayed
- Availability toggles show correct state

```typescript
it('should display all menu items correctly', () => {
  const mockCategories = [
    {
      id: 'cat_1',
      name: 'Appetizers',
      items: [
        { id: 'item_1', name: 'Spring Rolls', isAvailable: true, price: 10.00 },
        { id: 'item_2', name: 'Satay', isAvailable: false, price: 12.00 },
      ]
    }
  ];
  
  useMenuStore.getState().setCategories(mockCategories);
  
  render(<MenuScreen navigation={mockNavigation} />);
  
  // Verify categories
  expect(screen.getByText('Appetizers')).toBeTruthy();
  
  // Verify items
  expect(screen.getByText('Spring Rolls')).toBeTruthy();
  expect(screen.getByText('Satay')).toBeTruthy();
  
  // Verify prices
  expect(screen.getByText('$10.00')).toBeTruthy();
  expect(screen.getByText('$12.00')).toBeTruthy();
});
```

#### TC-MENU-002: Toggle Item Availability
**Given**: A menu item is displayed with availability toggle  
**When**: User taps the toggle button and confirms  
**Then**:
- Confirmation dialog is shown
- API call to `/menu/{id}/availability` is made
- Item availability state is toggled
- Success alert is displayed

```typescript
it('should toggle item availability', async () => {
  const mockCategories = [
    {
      id: 'cat_1',
      name: 'Appetizers',
      items: [
        { id: 'item_1', name: 'Spring Rolls', isAvailable: true, price: 10.00 }
      ]
    }
  ];
  
  useMenuStore.getState().setCategories(mockCategories);
  
  mockApi.patch('/menu/item_1/availability').reply(200, {
    status: 'success',
    data: { id: 'item_1', isAvailable: false }
  });
  
  render(<MenuScreen navigation={mockNavigation} />);
  
  // Find and tap toggle button for Spring Rolls
  const toggleButton = screen.getByTestId('toggle-item-1');
  await userEvent.tap(toggleButton);
  
  // Confirm dialog
  await userEvent.tap(screen.getByText('Confirm'));
  
  // Wait for API call
  await waitFor(() => expect(mockApi.history.patch.length).toBeGreaterThan(0));
  
  // Verify availability toggled
  expect(useMenuStore.getState().categories[0].items[0].isAvailable).toBe(false);
});
```

---

### 3.4 Analytics Hook Tests

#### TC-ANAL-001: Display Sales Summary
**Given**: Analytics data exists  
**When**: AnalyticsScreen is rendered  
**Then**:
- Revenue, orders, and AOV are displayed
- Trend indicators show correct direction
- Period selector works

```typescript
it('should display sales summary correctly', () => {
  const mockSales = {
    period: 'today',
    totalRevenue: 1250.00,
    totalOrders: 28,
    averageOrderValue: 44.64,
    trend: { revenue: 12, orders: 5 }
  };
  
  useAnalyticsStore.getState().setSales(mockSales);
  
  render(<AnalyticsScreen navigation={mockNavigation} />);
  
  // Verify metrics
  expect(screen.getByText('$1,250.00')).toBeTruthy();
  expect(screen.getByText('28')).toBeTruthy();
  expect(screen.getByText('$44.64')).toBeTruthy();
  
  // Verify trends
  expect(screen.getByText('▲ 12%')).toBeTruthy();
  expect(screen.getByText('▲ 5')).toBeTruthy();
});
```

---

## 4. Integration Test Specifications

### 4.1 Login Flow Integration

#### TC-AUTH-003: Complete Login Flow
**Given**: User opens the app  
**When**: User enters credentials and taps login  
**Then**:
- Auth store is populated with user data
- Navigation resets to MainTabs
- Subsequent API calls include auth token

```typescript
it('should complete full login flow', async () => {
  // Setup mocks
  mockApi.get('/auth/me').reply(200, {
    status: 'success',
    data: { user: { id: 'usr_1', email: 'test@test.com' } }
  });
  
  mockApi.post('/auth/login').reply(200, {
    status: 'success',
    data: {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      user: { id: 'usr_1', email: 'test@test.com', role: 'owner' }
    }
  });
  
  // Render and login
  render(<LoginScreen navigation={mockNavigation} />);
  await userEvent.type(emailInput, 'test@test.com');
  await userEvent.type(passwordInput, 'password123');
  await userEvent.tap(loginButton);
  
  // Wait for navigation
  await waitFor(() => expect(mockNavigation.reset).toHaveBeenCalled());
  
  // Verify auth store state
  expect(useAuthStore.getState().isAuthenticated).toBe(true);
  expect(useAuthStore.getState().user?.id).toBe('usr_1');
  
  // Verify token is set
  expect(useAuthStore.getState().accessToken).toBe('mock-token');
});
```

---

### 4.2 Order Management Flow Integration

#### TC-ORD-006: Complete Order Acceptance Flow
**Given**: User is on OrdersScreen with pending orders  
**When**: User accepts, prepares, and completes an order  
**Then**:
- Each status transition triggers correct API call
- UI updates immediately after each action
- Success messages are displayed

```typescript
it('should complete full order acceptance flow', async () => {
  const mockOrder = { id: 'ord_1', status: 'Pending', total: 45.50 };
  useOrderStore.getState().setOrders([mockOrder]);
  
  // Mock API calls for each status transition
  mockApi.post('/orders/ord_1/accept').reply(200, { status: 'success', data: { status: 'Accepted' } });
  mockApi.post('/orders/ord_1/prepare').reply(200, { status: 'success', data: { status: 'Preparing' } });
  mockApi.post('/orders/ord_1/complete').reply(200, { status: 'success', data: { status: 'Completed' } });
  
  render(<OrdersScreen navigation={mockNavigation} />);
  
  // Accept order
  await userEvent.tap(screen.getByText('Accept'));
  await userEvent.tap(screen.getByText('Confirm'));
  await waitFor(() => expect(useOrderStore.getState().orders[0].status).toBe('Accepted'));
  
  // Prepare order
  await userEvent.tap(screen.getByText('Prepare'));
  await userEvent.tap(screen.getByText('Confirm'));
  await waitFor(() => expect(useOrderStore.getState().orders[0].status).toBe('Preparing'));
  
  // Complete order
  await userEvent.tap(screen.getByText('Complete'));
  await userEvent.tap(screen.getByText('Confirm'));
  await waitFor(() => expect(useOrderStore.getState().orders[0].status).toBe('Completed'));
  
  // Verify all API calls were made
  expect(mockApi.history.post).toHaveLength(3);
});
```

---

## 5. Test Environment Setup

### 5.1 Mock Configuration

```typescript
// src/__mocks__/apiClient.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

export const mockApi = mock;
export default axios;
```

### 5.2 Store Mocking

```typescript
// src/__mocks__/stores.ts
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useMenuStore } from '../store/menuStore';

// Mock Zustand stores
jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../store/orderStore', () => ({
  useOrderStore: jest.fn(),
}));

jest.mock('../store/menuStore', () => ({
  useMenuStore: jest.fn(),
}));
```

### 5.3 Navigation Mocking

```typescript
// src/__mocks__/navigation.ts
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  getState: jest.fn(() => ({
    routes: [{ name: 'Login' }],
  })),
};
```

---

## 6. Test Execution Commands

### 6.1 Run All Tests
```bash
cd apps/restaurant-app
npm test
```

### 6.2 Run Specific Test File
```bash
npm test -- src/features/auth/hooks/useAuth.test.ts
```

### 6.3 Run Tests with Coverage
```bash
npm test -- --coverage
```

### 6.4 Run Tests in Watch Mode
```bash
npm test -- --watch
```

---

## 7. Test Data

### 7.1 Mock Orders
```typescript
const mockOrders = [
  {
    id: 'ord_1001',
    tenantId: 'tenant_siam_001',
    customerId: 'cust_456',
    customerName: 'John Doe',
    customerPhone: '0412345678',
    items: [
      { id: 'item_1', name: 'Pad Thai', quantity: 2, price: 15.50 },
      { id: 'item_2', name: 'Spring Rolls', quantity: 1, price: 10.00 }
    ],
    subtotal: 41.00,
    deliveryFee: 5.00,
    total: 46.00,
    status: 'Pending',
    fulfillmentMethod: 'delivery',
    deliveryAddress: '123 Main St, Sydney NSW 2000',
    notes: 'No spicy',
    createdAt: '2024-01-15T10:30:00Z'
  }
];
```

### 7.2 Mock Menu Items
```typescript
const mockCategories = [
  {
    id: 'cat_1',
    name: 'Appetizers',
    displayOrder: 1,
    items: [
      {
        id: 'item_1',
        name: 'Spring Rolls',
        description: 'Crispy spring rolls',
        price: 10.00,
        isAvailable: true,
        preparationTime: 5
      }
    ]
  }
];
```

### 7.3 Mock Analytics Data
```typescript
const mockSales = {
  period: 'today',
  totalRevenue: 1250.00,
  totalOrders: 28,
  averageOrderValue: 44.64,
  trend: { revenue: 12, orders: 5 }
};

const mockPopularItems = [
  { itemId: 'item_1', itemName: 'Pad Thai', quantitySold: 45, revenue: 697.50 },
  { itemId: 'item_2', itemName: 'Green Curry', quantitySold: 38, revenue: 760.00 }
];
```

---

## 8. Acceptance Criteria

### 8.1 Login Screen
- [ ] User can login with valid credentials
- [ ] User sees error message with invalid credentials
- [ ] Loading state is shown during login
- [ ] Navigation redirects to MainTabs after successful login
- [ ] Session persists across app restarts

### 8.2 Orders Screen
- [ ] All orders are displayed correctly
- [ ] Order status badges show correct colors
- [ ] User can accept pending orders
- [ ] User can prepare accepted orders
- [ ] User can complete orders
- [ ] Confirmation dialogs appear before actions
- [ ] Order list refreshes after actions

### 8.3 Menu Screen
- [ ] All categories and items are displayed
- [ ] User can toggle item availability
- [ ] User can edit menu items
- [ ] Changes are reflected immediately (optimistic updates)
- [ ] API errors are handled gracefully

### 8.4 Analytics Screen
- [ ] Sales summary displays correctly
- [ ] Popular items list shows correct data
- [ ] Period selector works (today/week/month)
- [ ] Charts render correctly (when implemented)

---

## 9. Test Maintenance

### 9.1 When to Update Tests
- New features are added
- Existing features are modified
- API contracts change
- UI components are refactored

### 9.2 Test Documentation
- Each test should have a clear description of what it tests
- Test data should be documented
- Mock configurations should be maintained

---

**End of Test Specification**