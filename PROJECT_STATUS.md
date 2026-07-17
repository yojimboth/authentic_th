# Project State Manifest: authentic_th
**Last Updated**: July 17, 2026
**Current Phase**: Frontend-First Implementation (Mocked Backend)

## 1. 🏗️ Architecture & Structure
- **Overall Pattern**: Modular Monolith (Backend) / Feature-Based Architecture (Frontend).
- **Customer App Path**: `apps/customer-app/`
- **Technical Stack**: React Native (Expo), TypeScript, NativeWind v2 (Tailwind), Zustand (State), React Navigation.
- **Structural Alignment**: The codebase is synchronized with the `customer_app_sdd.md`.
    - **Screens**: `features/*/screens/`
    - **Components**: `features/*/components/` or `components/common/`
    - **Hooks**: `features/*/hooks/`

## 2. ✅ Implemented Features (Customer App)
### **Core Navigation**
- **RootNavigator**: Implemented with a `MainTabs` and `RootStack` structure.
- **Auth Flow**: Mocked authentication starting from `SplashScreen` $\rightarrow$ `MainTabs`.

### **Feature: Menu**
- **MenuScreen**: Implemented with a branded header and dynamic tenant support.
- **FoodItemCard**: Implemented for product listing.
- **FoodItemDetailScreen**: Implemented for item specifics and modifiers.

### **Feature: Cart & Checkout**
- **CartScreen**: Implemented with quantity controls, total calculations, and a full-width Delivery/Pickup toggle.
- **CheckoutScreen**: Implemented with dynamic delivery fee calculation, loyalty point redemption, and a "Back to Cart" link.
- **ConfirmationScreen**: Implemented with a "Return to Home" action that resets the navigation stack.
- **Cart State**: `useCartStore` (Zustand) manages items and the chosen fulfillment method.

### **Feature: Profile**
- **ProfileScreen**: Implemented as a clean, read-only summary view (Labels and Data on separate lines).
- **EditProfileScreen**: Implemented as a dedicated edit view with phone input and a multiline address textarea.
- **Loyalty Card**: Implemented in the profile with a "softened" brand-primary theme (low opacity background).

### **Common components**
- **StoreLogo**: Dynamic component handling local `require()` assets and remote URLs.
- **Typography/Button/GlobalSafeWrapper**: Basic atomic design components implemented.

## 3. 🛠️ Critical Technical Decisions (The "Memory" Log)
- **NativeWind v2 Pitfall**: Dynamic class strings (template literals) are not reliably picked up by static analysis. **FIX**: Use `style` prop for dynamic layout changes (e.g., margins).
- **Image Loading**: Bundle assets using `require()` for local mocks to avoid `file://` protocol errors in Expo.
- **Navigation Reset**: Use `navigation.reset` when returning from the Confirmation screen to prevent users from navigating "back" into the checkout flow.

## 4. 🚧 Pending Work (Immediate Next Steps)
- [ ] **Complete Menu Interactivity**: Connect "Add to Cart" buttons in `FoodItemCard` to the `useCartStore`.
- [ ] **Implement Category Filtering**: Add the horizontal category scroll to `MenuScreen`.
- [ ] **Order History**: Flesh out `OrderHistoryScreen` and `OrderStatusDetailScreen`.
- [ ] **API Integration**: Transition from mock hooks to real `apiClient` calls to the Rust backend.
