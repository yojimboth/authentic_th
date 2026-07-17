# Program Specifications: Restaurant Mobile App
**Project:** authentic_th  
**Version:** 1.0  
**Status:** Draft  
**Traceability:** SDD Section 5, 6 | UX/UI Specification | BRD UR-RO01, UR-RO02, UR-RO03

---

## 1. Overview

This document provides detailed program logic, pseudo-code, and API contracts for the Restaurant Mobile App. It serves as the final blueprint before implementation.

**Scope**: Restaurant Owner/Manager mobile application for order management, menu management, and sales analytics.

**Technology Stack**:
- React Native (Expo ~54.0.0)
- TypeScript ~5.9.2
- NativeWind v2 (Tailwind CSS)
- Zustand ^4.5.0 (State Management)
- React Navigation ^6.x
- Axios ^1.18.1
- expo-secure-store, expo-crypto (Security)

---

## 2. API Contracts (Final)

### 2.1 Authentication Endpoints

#### POST /api/v1/auth/login
**Description**: Authenticate restaurant owner and receive JWT token.

**Request**:
```json
{
  "email": "john@siamauthentic.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "user": {
      "id": "usr_123",
      "email": "john@siamauthentic.com",
      "fullName": "John Smith",
      "role": "owner",
      "tenantId": "tenant_siam_001"
    }
  }
}
```

**Response** (401 Unauthorized):
```json
{
  "status": "error",
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password"
  }
}
```

---

#### GET /api/v1/auth/me
**Description**: Get current authenticated user profile.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "usr_123",
    "email": "john@siamauthentic.com",
    "fullName": "John Smith",
    "role": "owner",
    "tenantId": "tenant_siam_001",
    "tenant": {
      "name": "Siam Authentic",
      "logoUrl": "https://..."
    }
  }
}
```

---

### 2.2 Order Endpoints

#### GET /api/v1/orders
**Description**: List orders for the current tenant with optional filtering.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Query Parameters**:
- `status` (optional): Filter by status (Pending, Accepted, Preparing, Ready, Completed, Cancelled)
- `limit` (optional, default 50): Maximum number of orders
- `offset` (optional, default 0): Pagination offset

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "id": "ord_1001",
      "tenantId": "tenant_siam_001",
      "customerId": "cust_456",
      "customerName": "John Doe",
      "customerPhone": "0412345678",
      "items": [
        {
          "id": "item_1",
          "name": "Pad Thai",
          "quantity": 2,
          "price": 15.50,
          "modifiers": ["Extra Sauce"]
        }
      ],
      "subtotal": 31.00,
      "deliveryFee": 5.00,
      "loyaltyDiscount": 0,
      "total": 36.00,
      "status": "Pending",
      "fulfillmentMethod": "delivery",
      "deliveryAddress": "123 Main St, Sydney NSW 2000",
      "notes": "No spicy",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "perPage": 50
  }
}
```

---

#### PATCH /api/v1/orders/{id}/status
**Description**: Update order status.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Request**:
```json
{
  "status": "Accepted"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "ord_1001",
    "status": "Accepted",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Response** (400 Bad Request):
```json
{
  "status": "error",
  "error": {
    "code": "ORDER_001",
    "message": "Invalid status transition from Pending to Completed"
  }
}
```

---

#### POST /api/v1/orders/{id}/accept
**Description**: Accept a pending order.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "ord_1001",
    "status": "Accepted",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

---

#### POST /api/v1/orders/{id}/prepare
**Description**: Mark order as preparing.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "ord_1001",
    "status": "Preparing",
    "updatedAt": "2024-01-15T10:40:00Z"
  }
}
```

---

#### POST /api/v1/orders/{id}/complete
**Description**: Mark order as completed.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "ord_1001",
    "status": "Completed",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### 2.3 Menu Endpoints

#### GET /api/v1/menu
**Description**: List all menu items and categories for the current tenant.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "cat_1",
        "name": "Appetizers",
        "displayOrder": 1,
        "items": [
          {
            "id": "item_1",
            "name": "Spring Rolls",
            "description": "Crispy spring rolls with sweet chili sauce",
            "price": 10.00,
            "imageUrl": "https://...",
            "isAvailable": true,
            "preparationTime": 5
          }
        ]
      }
    ]
  }
}
```

---

#### PATCH /api/v1/menu/{id}
**Description**: Update menu item details.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Request**:
```json
{
  "name": "Spring Rolls",
  "description": "Crispy spring rolls with sweet chili sauce",
  "price": 11.00,
  "preparationTime": 5
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "item_1",
    "name": "Spring Rolls",
    "price": 11.00,
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

#### PATCH /api/v1/menu/{id}/availability
**Description**: Toggle menu item availability.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Request**:
```json
{
  "isAvailable": false
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "item_1",
    "isAvailable": false,
    "updatedAt": "2024-01-15T12:05:00Z"
  }
}
```

---

### 2.4 Analytics Endpoints

#### GET /api/v1/analytics/sales
**Description**: Get sales summary for the current tenant.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Query Parameters**:
- `period` (optional, default today): today, week, month

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "period": "today",
    "totalRevenue": 1250.00,
    "totalOrders": 28,
    "averageOrderValue": 44.64,
    "trend": {
      "revenue": 12,
      "orders": 5
    }
  }
}
```

---

#### GET /api/v1/analytics/popular
**Description**: Get popular items for the current tenant.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Query Parameters**:
- `limit` (optional, default 10): Maximum number of items

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "itemId": "item_1",
      "itemName": "Pad Thai",
      "quantitySold": 45,
      "revenue": 697.50
    }
  ]
}
```

---

### 2.5 Profile Endpoints

#### PATCH /api/v1/profile
**Description**: Update restaurant owner profile.

**Headers**:
```
Authorization: Bearer <access_token>
x-tenant-id: tenant_siam_001
```

**Request**:
```json
{
  "phone": "0412345678",
  "primaryAddress": "123 Restaurant St, Sydney NSW 2000"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "usr_123",
    "phone": "0412345678",
    "primaryAddress": "123 Restaurant St, Sydney NSW 2000",
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

---

## 3. State Management Design

### 3.1 Auth Store (Zustand)

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSession {
  accessToken: string | null;
  refreshToken: string | null;
  user: RestaurantOwner | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: RestaurantOwner | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<UserSession>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

### 3.2 Order Store (Zustand)

```typescript
// src/store/orderStore.ts
import { create } from 'zustand';
import { Order } from '../features/orders/types';

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  setOrders: (orders: Order[]) => void;
  setActiveOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  activeOrder: null,
  isLoading: false,
  error: null,
  
  setOrders: (orders) => set({ orders }),
  setActiveOrder: (order) => set({ activeOrder: order }),
  
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ),
    activeOrder: state.activeOrder?.id === orderId 
      ? { ...state.activeOrder, status, updatedAt: new Date().toISOString() }
      : state.activeOrder,
  })),
  
  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
  })),
  
  clearOrders: () => set({ orders: [], activeOrder: null }),
  
  setError: (error) => set({ error }),
}));
```

---

### 3.3 Menu Store (Zustand)

```typescript
// src/store/menuStore.ts
import { create } from 'zustand';
import { MenuItem, MenuCategory } from '../features/menu/types';

interface MenuState {
  categories: MenuCategory[];
  isLoading: boolean;
  setError: (error: string | null) => void;
  setCategories: (categories: MenuCategory[]) => void;
  toggleItemAvailability: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<MenuItem>) => void;
  clearMenu: () => void;
}

export const useMenuStore = create<MenuState>()((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  
  setCategories: (categories) => set({ categories }),
  
  toggleItemAvailability: (itemId) => set((state) => ({
    categories: state.categories.map((category) => ({
      ...category,
      items: category.items.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      ),
    })),
  })),
  
  updateItem: (itemId, updates) => set((state) => ({
    categories: state.categories.map((category) => ({
      ...category,
      items: category.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    })),
  })),
  
  clearMenu: () => set({ categories: [] }),
  
  setError: (error) => set({ error }),
}));
```

---

## 4. Hook Specifications

### 4.1 useAuth Hook

```typescript
// src/features/auth/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import apiClient from '../../../services/apiClient';

export const useAuth = () => {
  const { user, isAuthenticated, setIsAuthenticated, setUser, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        storeLogout();
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data.data;
      
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setIsAuthenticated(true);
      
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Ignore logout errors
    }
    storeLogout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};
```

---

### 4.2 useOrders Hook

```typescript
// src/features/orders/hooks/useOrders.ts
import { useState, useEffect } from 'react';
import { useOrderStore } from '../../../store/orderStore';
import apiClient from '../../../services/apiClient';
import { Order } from '../types';

export const useOrders = (status?: string) => {
  const { orders, isLoading, setOrders, addOrder, updateOrderStatus, clearOrders } = useOrderStore();
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const params: any = {};
      if (status) params.status = status;
      
      const response = await apiClient.get('/orders', { params });
      const newOrders = response.data.data;
      
      setOrders(newOrders);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch orders');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [status]);

  // Polling for real-time updates (mocked)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [status]);

  const acceptOrder = async (orderId: string) => {
    try {
      await apiClient.post(`/orders/${orderId}/accept`);
      updateOrderStatus(orderId, 'Accepted');
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to accept order');
      return { success: false };
    }
  };

  const prepareOrder = async (orderId: string) => {
    try {
      await apiClient.post(`/orders/${orderId}/prepare`);
      updateOrderStatus(orderId, 'Preparing');
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to prepare order');
      return { success: false };
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      await apiClient.post(`/orders/${orderId}/complete`);
      updateOrderStatus(orderId, 'Completed');
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to complete order');
      return { success: false };
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId) || null;
  };

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    acceptOrder,
    prepareOrder,
    completeOrder,
    getOrderById,
  };
};
```

---

### 4.3 useMenu Hook

```typescript
// src/features/menu/hooks/useMenu.ts
import { useState, useEffect } from 'react';
import { useMenuStore } from '../../../store/menuStore';
import apiClient from '../../../services/apiClient';
import { MenuItem, MenuCategory } from '../types';

export const useMenu = () => {
  const { categories, isLoading, setCategories, toggleItemAvailability, updateItem, clearMenu } = useMenuStore();
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      const response = await apiClient.get('/menu');
      const data = response.data.data;
      
      // Transform response to match MenuCategory structure
      const menuCategories: MenuCategory[] = data.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        displayOrder: cat.displayOrder,
        items: cat.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          isAvailable: item.isAvailable,
          preparationTime: item.preparationTime,
        })),
      }));
      
      setCategories(menuCategories);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch menu');
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const toggleAvailability = async (itemId: string) => {
    try {
      // Optimistic update
      toggleItemAvailability(itemId);
      
      // API call
      await apiClient.patch(`/menu/${itemId}/availability`);
      return { success: true };
    } catch (err: any) {
      // Rollback on error
      fetchMenu();
      setError(err.response?.data?.error?.message || 'Failed to update availability');
      return { success: false };
    }
  };

  const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>) => {
    try {
      // Optimistic update
      updateItem(itemId, updates);
      
      // API call
      await apiClient.patch(`/menu/${itemId}`, updates);
      return { success: true };
    } catch (err: any) {
      // Rollback on error
      fetchMenu();
      setError(err.response?.data?.error?.message || 'Failed to update menu item');
      return { success: false };
    }
  };

  return {
    categories,
    isLoading,
    error,
    fetchMenu,
    toggleAvailability,
    updateMenuItem,
  };
};
```

---

### 4.4 useAnalytics Hook

```typescript
// src/features/analytics/hooks/useAnalytics.ts
import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

interface SalesSummary {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  trend: {
    revenue: number;
    orders: number;
  };
}

interface PopularItem {
  itemId: string;
  itemName: string;
  quantitySold: number;
  revenue: number;
}

export const useAnalytics = (period: 'today' | 'week' | 'month' = 'today') => {
  const [sales, setSales] = useState<SalesSummary | null>(null);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/analytics/sales', {
        params: { period },
      });
      setSales(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch sales data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopular = async () => {
    try {
      const response = await apiClient.get('/analytics/popular');
      setPopularItems(response.data.data);
    } catch (err: any) {
      // Non-critical error, don't set global error
      console.error('Failed to fetch popular items:', err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchPopular();
  }, [period]);

  return {
    sales,
    popularItems,
    isLoading,
    error,
    refetch: () => {
      fetchSales();
      fetchPopular();
    },
  };
};
```

---

## 5. Screen Implementation Logic

### 5.1 LoginScreen Logic

```typescript
// Pseudo-code for LoginScreen
export const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (!password || password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    const result = await login(email, password);
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  };

  // Render login form with email, password, and login button
};
```

---

### 5.2 OrdersScreen Logic

```typescript
// Pseudo-code for OrdersScreen
export const OrdersScreen = ({ navigation }) => {
  const { orders, isLoading, acceptOrder, prepareOrder, completeOrder } = useOrders();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(order.status);
    }
    if (filter === 'completed') {
      return ['Completed', 'Cancelled'].includes(order.status);
    }
    return true;
  });

  const handleAccept = async (orderId) => {
    const confirmed = await showConfirmation('Accept Order', 'Are you sure?');
    if (confirmed) {
      await acceptOrder(orderId);
    }
  };

  const handlePrepare = async (orderId) => {
    const confirmed = await showConfirmation('Start Preparing', 'Mark order as preparing?');
    if (confirmed) {
      await prepareOrder(orderId);
    }
  };

  const handleComplete = async (orderId) => {
    const confirmed = await showConfirmation('Complete Order', 'Mark order as completed?');
    if (confirmed) {
      await completeOrder(orderId);
    }
  };

  // Render order list with filter tabs and order cards
};
```

---

### 5.3 MenuScreen Logic

```typescript
// Pseudo-code for MenuScreen
export const MenuScreen = ({ navigation }) => {
  const { categories, isLoading, toggleAvailability, updateMenuItem } = useMenu();

  const handleToggleAvailability = async (itemId) => {
    const item = findItemInCategories(categories, itemId);
    const confirmed = await showConfirmation(
      'Toggle Availability',
      `Mark ${item.name} as ${item.isAvailable ? 'unavailable' : 'available'}?`
    );
    if (confirmed) {
      await toggleAvailability(itemId);
    }
  };

  const handleEditItem = (item) => {
    navigation.navigate('EditItem', { itemId: item.id, item });
  };

  // Render menu with categories and items
};
```

---

## 6. Error Handling Strategy

### 6.1 Error Types
```typescript
type AppError = 
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';
```

### 6.2 Error Display
- **Network Error**: Show offline banner at top of screen
- **Auth Error**: Auto-logout and redirect to login
- **Validation Error**: Show inline error below input field
- **Server Error**: Show alert dialog with retry button
- **Unknown Error**: Log to console and show generic error message

### 6.3 Retry Logic
- Automatic retry for network errors (up to 3 attempts)
- Manual retry button for server errors
- Exponential backoff for retries

---

## 7. Testing Requirements

### 7.1 Unit Tests
- Auth hooks (login, logout, session check)
- Order hooks (accept, prepare, complete)
- Menu hooks (toggle availability, update item)
- Analytics hooks (fetch sales, popular items)

### 7.2 Integration Tests
- Login flow (valid/invalid credentials)
- Order status transitions
- Menu item updates
- Navigation flow

### 7.3 E2E Tests
- Complete order acceptance flow
- Menu management workflow
- Analytics data display

---

**End of Program Specifications**