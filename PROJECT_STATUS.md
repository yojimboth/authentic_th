# Project State Manifest: authentic_th
**Last Updated**: July 17, 2026  
**Current Phase**: Frontend-First Implementation (Both Apps Complete - Mocked Backend)

---

## 1. 🏗️ Architecture & Structure

- **Overall Pattern**: Modular Monolith (Backend) / Feature-Based Architecture (Frontend).
- **Customer App Path**: `apps/customer-app/`
- **Restaurant App Path**: `apps/restaurant-app/`
- **Technical Stack**: React Native (Expo), TypeScript, NativeWind v2 (Tailwind), Zustand (State), React Navigation.
- **Structural Alignment**: Both apps synchronized with respective SDD documents.
    - **Screens**: `features/*/screens/`
    - **Components**: `features/*/components/` or `components/common/`
    - **Hooks**: `features/*/hooks/`

---

## 2. ✅ Implemented Features

### **Customer App** (`apps/customer-app/`)

#### **Core Navigation**
- **RootNavigator**: Implemented with `MainTabs` and `RootStack` structure.
- **Auth Flow**: Token-based authentication with mock JWT, SecureStore integration.

#### **Feature: Menu**
- **MenuScreen**: Implemented with branded header, dynamic tenant support, and category quick-nav.
- **FoodItemCard**: Implemented for product listing with "Add to Cart" functionality.
- **FoodItemDetailScreen**: Implemented for item specifics and modifiers.

#### **Feature: Cart & Checkout**
- **CartScreen**: Implemented with quantity controls, total calculations, and Delivery/Pickup toggle.
- **CheckoutScreen**: Implemented with price verification security, loyalty point redemption, and cart items submission (not calculated totals).
- **ConfirmationScreen**: Implemented with "Return to Home" action that resets the navigation stack.
- **Cart State**: `useCartStore` (Zustand) manages items and fulfillment method.

#### **Feature: Profile**
- **ProfileScreen**: Implemented as a clean, read-only summary view.
- **EditProfileScreen**: Implemented with Australian phone validation and address sanitization.
- **Loyalty Card**: Implemented with brand-primary theme.

#### **Security Fixes (P0 Critical & High - Completed)**
- ✅ Secure random token generation using `expo-crypto`
- ✅ Token encryption at rest using `expo-secure-store`
- ✅ Dynamic user identity (no hardcoded user IDs)
- ✅ Proper token validation with expiration checking
- ✅ Functional logout button
- ✅ Tenant configuration validation

#### **Security Fixes (Medium & Low - Completed)**
- ✅ Complete input sanitization (maxLength + null byte filtering)
- ✅ Sanitized error messages (no internal detail leakage)
- ✅ Rate limiting on authentication (5 attempts = 15-min lockout)
- ✅ Cart data retention cleanup
- ✅ Audit logging for security events
- ✅ Biometric authentication support (`expo-local-authentication`)
- ✅ Price verification with $10K ceiling
- ✅ Type-safe navigation (no `useNavigation<any>()`)
- ✅ Environment variable configuration
- ✅ SSL pinning documentation
- ✅ Input maxLength validation
- ✅ CVE transparency documentation

---

### **Restaurant App** (`apps/restaurant-app/`) - NEW

#### **Core Navigation**
- **RootNavigator**: Token-based authentication flow.
- **MainTabsNavigator**: Bottom tab navigation (Orders, Menu, Analytics, Profile).

#### **Feature: Auth**
- **SplashScreen**: Brand display with token generation.
- **LoginScreen**: Email/password login with validation and error handling.
- **useAuth**: Authentication hook with mock JWT and SecureStore.

#### **Feature: Orders**
- **OrdersScreen**: Order list with status filter (All/Active/Completed).
- **OrderDetailScreen**: Order details with status update buttons (Accept/Prepare/Complete).
- **OrderCard**: Reusable component with order summary and action buttons.
- **OrderStatusBadge**: Color-coded status indicators.
- **useOrders**: Orders hook with polling (10s interval) and status update functions.

#### **Feature: Menu**
- **MenuScreen**: Menu list organized by categories with availability toggles.
- **EditItemScreen**: Form to edit menu item details (name, description, price, prep time).
- **MenuItemCard**: Reusable component with availability toggle and edit button.
- **useMenu**: Menu hook with optimistic updates for availability toggles.

#### **Feature: Analytics**
- **AnalyticsScreen**: Sales summary (revenue, orders, AOV) with period selector.
- **SummaryCard**: Displays metrics with trend indicators.
- **PopularItemRow**: Top items by quantity sold.
- **useAnalytics**: Analytics hook with mock data for sales and popular items.

#### **Feature: Profile**
- **ProfileScreen**: Owner profile display with settings options.
- **EditProfileScreen**: Edit profile form with validation.
- **useProfile**: Profile hook with mock data.

#### **State Management**
- **authStore**: User session, tokens, authentication state.
- **orderStore**: Orders list, active order, status updates.
- **menuStore**: Menu categories, items, availability.

#### **Testing**
- **16 test suites, 75 tests**: All passing
  - Store tests (auth, order, menu)
  - Component tests (Button, Typography, OrderCard, etc.)
  - Hook tests (useAuth, useOrders, useMenu, useAnalytics)
  - Screen tests (Login, Orders, Menu, Analytics, Profile)

---

## 3. 📚 Documentation

### **Specifications Created**
- **SDD**: `specifications/sdd/restaurant_app_sdd.md`
- **UX/UI**: `specifications/ux_ui/restaurant_app_uxui.md`
- **Program Specs**: `specifications/programs/restaurant_app_program_spec.md`
- **Test Spec**: `specifications/tests/restaurant_app_test_spec.md`

### **Existing Specifications**
- **BRD**: `specifications/BRD_authentic_th.md`
- **SAD**: `specifications/SAD_authentic_th.md`
- **Overall SDD**: `specifications/sdd/overall_sdd.md`
- **Customer App SDD**: `specifications/sdd/customer_app_sdd.md`

---

## 4. 🛠️ Critical Technical Decisions (The "Memory" Log)

- **NativeWind v2 Pitfall**: Dynamic class strings (template literals) are not reliably picked up by static analysis. **FIX**: Use `style` prop for dynamic layout changes.
- **Image Loading**: Bundle assets using `require()` for local mocks to avoid `file://` protocol errors in Expo.
- **Navigation Reset**: Use `navigation.reset` when returning from confirmation screens to prevent back navigation.
- **Security First**: All security fixes implemented before new feature development.
- **Spec-Driven Development**: Followed strict BRD → SAD → SDD → UX/UI → Program → Test → Implementation flow.

---

## 5. 📊 Project Metrics

| Metric | Customer App | Restaurant App |
|--------|--------------|----------------|
| **Screens** | 8 | 10 |
| **Features** | 5 (Auth, Menu, Cart, Checkout, Profile) | 5 (Auth, Orders, Menu, Analytics, Profile) |
| **Tests** | 17 | 75 |
| **Security Fixes** | 19 (3 Critical, 4 High, 7 Medium, 5 Low) | Applied same security patterns |
| **Dependencies** | 15+ | 15+ |
| **TypeScript Errors** | 0 (new) | 0 |

---

## 6. 🚧 Current Status & Next Steps

### **Completed**
- ✅ Customer App frontend with mocked backend
- ✅ Customer App security hardening (19 fixes)
- ✅ Restaurant App frontend with mocked backend
- ✅ Restaurant App tests (75 passing)
- ✅ All specification documents created

### **Next Phase: Real Backend (Rust/Axum)**

**Prerequisites:**
1. Both frontends validated with mocked data ✅
2. API contracts defined in Program Specifications ✅
3. Security patterns established ✅

**Recommended Actions:**
1. **Start Backend Implementation**: Begin Rust/Axum development based on API contracts
2. **Database Schema**: Implement PostgreSQL schema from Overall SDD
3. **Authentication Service**: Build JWT/RBAC system
4. **API Endpoints**: Implement endpoints for both Customer and Restaurant apps
5. **Integration Testing**: Connect frontends to real backend

**Backend Modules (from Overall SDD):**
- `crates/auth/` - Identity, JWT, RBAC
- `crates/tenants/` - Tenant provisioning, isolation
- `crates/orders/` - Order lifecycle, state machine
- `crates/loyalty/` - Points calculation, transactions
- `crates/common/` - Shared types, error model
- `crates/api_gateway/` - Axum router, middleware

---

## 7. 🔐 Security Posture

**Current State**: Production-Ready Security Patterns

- ✅ Cryptographically secure authentication tokens
- ✅ Encrypted sensitive data storage (Keychain/Keystore)
- ✅ Rate limiting on authentication
- ✅ Comprehensive input validation and sanitization
- ✅ Audit logging for security events
- ✅ Biometric authentication support
- ✅ Type-safe navigation
- ✅ Proper error handling without information leakage

**Remaining for Production:**
- ⏳ Server-side authorization (when backend is built)
- ⏳ Real JWT verification (replace mock)
- ⏳ SSL certificate pinning (native code)
- ⏳ Advanced analytics and monitoring

---

**End of Project State Manifest**