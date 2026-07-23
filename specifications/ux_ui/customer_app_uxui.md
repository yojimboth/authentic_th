# UX/UI Specification: Customer Mobile App (Guest & Member)
**Project**: authentic_th Food Ordering Ecosystem  
**Design Persona**: "Fresh & Appetizing" | **Primary Color**: `brand-orange` (#FF6B00)  
**Font**: Poppins (Headings) / Inter (Body) | **Status**: Final Specification

---

## 1. Design System

### 1.1 Brand Mapping

| Element | Siam Authentic | Thai Breeze Express |
|---------|---------------|---------------------|
| **Primary** | `#FF6B00` (Orange) | `#00A86B` (Teal) |
| **Secondary** | `#F59E0B` (Amber) | `#059669` (Emerald) |
| **Background** | `zinc-50` (#FAFAF9) | `zinc-50` (#FAFAF9) |
| **Text Primary** | `zinc-900` (#18181B) | `zinc-900` (#18181B) |
| **Text Secondary** | `zinc-500` (#71717A) | `zinc-500` (#71717A) |
| **Border** | `zinc-200` (#E4E4E7) | `zinc-200` (#E4E4E7) |
| **Success** | `emerald-500` (#10B981) | `emerald-500` (#10B981) |
| **Danger** | `rose-500` (#F43F5E) | `rose-500` (#F43F5E) |

### 1.2 Typography

| Level | Size / Weight | Family | Usage |
|-------|--------------|--------|-------|
| **h1** | 30px / 700 Bold | Poppins | Main Page Titles |
| **h2** | 24px / 600 Semibold | Poppins | Section Headers, Prices |
| **h3** | 18px / 500 Medium | Inter | Card Titles |
| **body** | 16px / 400 Regular | Inter | Standard Paragraphs |
| **caption** | 12px / 400 Regular | Inter | Metadata, Labels |

### 1.3 Spacing Scale

Base unit: 4px. Common values: 4, 8, 12, 16, 24, 32, 40, 48, 64, 100

### 1.4 Component Library

#### Card
- **Layout**: `p-4 bg-white border border-zinc-200 rounded-xl shadow-sm`
- **Shadow**: `shadowColor: #000, shadowOffset: {0, 1}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2`
- **Variants**: Elevated (featured items), Flat (list items)

#### Button
- **Layout**: `px-4 py-3 rounded-lg`
- **Primary**: `bg-brand-primary text-white`
- **Secondary**: `border-2 border-brand-primary text-brand-primary bg-transparent`
- **Ghost**: `text-zinc-600 hover:bg-zinc-100`
- **Danger**: `bg-rose-500 text-white`

#### Input Field
- **Layout**: `px-3 py-2 border rounded-md border-zinc-300`
- **Focus**: `border-brand-primary ring-2 ring-brand-primary/20`
- **Error**: `border-rose-500`

#### Badge
- **Layout**: `px-2 py-0.5 rounded-full text-xs font-semibold`
- **Success**: `bg-emerald-100 text-emerald-700`
- **Warning**: `bg-amber-100 text-amber-700`
- **Danger**: `bg-rose-100 text-rose-700`

---

## 2. Navigation Flow

```
Splash → MainTabs (Menu | Cart | Orders | Profile)
                    ↓
        AuthChoice (stack, checkout flow)
                    ↓
        AuthScreen (email OTP) → ProfileCreation
                    ↓
        CheckoutScreen → ConfirmationScreen
                    ↓
        OrderDetailsScreen (status)
```

**Tab Bar**: 4 tabs (Menu, Cart, Orders, Profile) with brand-colored active state.

---

## 3. Screen Specifications

### 3.1 Splash Screen
**Purpose**: Brand introduction during authentication

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│            [StoreLogo]                   │
│            (120x120, rounded-full)       │
│                                         │
│     Restaurant Name (h2, Poppins)       │
│     Slogan (body, zinc-500)             │
│                                         │
│           [ActivityIndicator]            │
│           (brand-primary color)          │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior**:
- Display for 1.5 seconds minimum
- Generate mock JWT token
- Transition to MainTabs if valid session exists

**Components**: `StoreLogo`, `Typography`, `ActivityIndicator`

---

### 3.2 AuthChoice Screen
**Purpose**: Present guest or member choice before checkout

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│            [StoreLogo]                   │
│            (120x120)                     │
│                                         │
│     Restaurant Name (h2)                │
│     Slogan (body, zinc-500)             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       Continue as Guest         │   │
│  │       (secondary variant)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       Become a Member           │   │
│  │       (primary variant)         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  "Member benefits: Earn loyalty points  │
│   on every order" (caption)             │
│                                         │
└─────────────────────────────────────────┘
```

**Components**: `StoreLogo`, `Typography`, `Button` (primary + secondary)

**Interactions**:
- "Continue as Guest" → Stay on checkout, set guest flag
- "Become a Member" → Navigate to AuthScreen

**States**: Static (no loading/error)

---

### 3.3 Auth Screen (Email OTP Flow)
**Purpose**: Passwordless email OTP authentication

**Layout** (Step 1 - Email Entry):
```
┌─────────────────────────────────────────┐
│  (pt-12)                                │
│  Enter Email (h1)                       │
│  "Enter the email address we'll send    │
│   a code to" (body, zinc-500)           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ email@example.com               │   │
│  │ _____________________________   │   │
│  └─────────────────────────────────┘   │
│  {error: "Please enter a valid email"}  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Send Code               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Resend code (05:00) (brand-primary)    │
└─────────────────────────────────────────┘
```

**Layout** (Step 2 - Code Entry):
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│  Verification Code (h1)                 │
│  "We sent a code to user@email.com     │
│   (tap to change)" (body)               │
│                                         │
│  [ ] [ ] [ ] [ ] [ ] [ ]              │
│   6 individual boxes                    │
│                                         │
│  {error (rose-500, centered)}           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │          Verify                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Resend code (04:58)                    │
└─────────────────────────────────────────┘
```

**Components**: `TextInput`, `Typography`, `Button`, custom 6-box code display

**Validation**:
- Email: RFC 5322 simplified regex
- Code: Exactly 6 digits (numeric input)
- Resend cooldown: 300 seconds (5 minutes)

**States**: `email` | `code` | `loading` | `error`

**API Dependencies**:
- `POST /auth/request-code` → Send OTP
- `POST /auth/verify-code` → Verify OTP

---

### 3.4 Profile Creation Screen
**Purpose**: Collect name and phone from newly authenticated user

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│  (pt-12)                                │
│  Welcome! (h1)                          │
│  "Set up your profile to start          │
│   earning points" (body, zinc-500)      │
│                                         │
│  Full Name (label)                      │
│  ┌─────────────────────────────────┐   │
│  │ Liam Wilson                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Phone Number (label)                   │
│  ┌─────────────────────────────────┐   │
│  │ 0412 345 678                    │   │
│  └─────────────────────────────────┘   │
│  "Format: 04XX XXX XXX" (caption)       │
│                                         │
│  {error (rose-500)}                     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │          Continue               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Components**: `TextInput`, `Typography`, `Button`

**Validation**:
- Name: 2-60 characters
- Phone: Australian mobile format `/^04\d{8}$/` (10 digits starting with 04)
- Phone auto-formatting: Spaces at positions 4 and 7

**API Dependencies**:
- `POST /auth/complete-profile` → Complete registration

---

### 3.5 Menu Screen
**Purpose**: Display categorized menu with horizontal category quick-nav

**Layout**:
```
┌─────────────────────────────────────────┐
│  [Sticky Header]                        │
│  [Logo 56px] Restaurant Name            │
│           Slogan                        │
│  [Appetizers] [Curries] [Noodles]       │
│  [Soups] [Desserts] (horizontal scroll) │
├─────────────────────────────────────────┤
│  Appetizers (text-2xl, Poppins)         │
│  ┌─────────────────────────────────┐   │
│  │ [FoodItemCard x3]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Curries (text-2xl, Poppins)            │
│  ┌─────────────────────────────────┐   │
│  │ [FoodItemCard x4]              │   │
│  └─────────────────────────────────┘   │
│  ... (repeat for each category)         │
│                                         │
│  [Spacer: h-20 at bottom]               │
└─────────────────────────────────────────┘
```

**Components**: `StoreLogo`, `Typography`, `FoodItemCard` (repeated), horizontal `ScrollView` for category pills

**Interactions**:
- Tap category pill → smooth scroll to category
- Tap `FoodItemCard` → Add to cart (or navigate to detail)

**Mock Menu Data**:
- Appetizers (3): Spring Rolls, Satay Chicken, Thai Meatballs
- Curries (4): Green, Red, Massaman, Panang
- Noodles & Rice (4): Pad Thai, Drunken Noodles, Pad Kra Pao, Thai Fried Rice
- Soups (2): Tom Yum Goong, Tom Kha Gai
- Desserts (2): Mango Sticky Rice, Banana Fritters

**API Dependencies**:
- `GET /menu` → Load categorized menu

---

### 3.6 FoodItemCard (Component)
**Purpose**: Display individual menu item

**Layout**:
```
┌─────────────────────────────────────────┐
│  [Image 100x100]  │  Item Name (h3)     │
│                   │                      │
│                   │  [●][●][●][○][○]    │
│                   │    (spice dots)      │
│                   │                      │
│                   │  Description         │
│                   │                      │
│                   │  ─────────────────   │
│                   │  $XX.XX  [Add to    │
│                   │             Order]   │
└─────────────────────────────────────────┘
```

**Props**: `item: FoodItem`, `onAddToCart: (item: FoodItem) => void`, `category?: string`

**Interactions**: `onAddToCart` fires on "Add to Order" button press.

---

### 3.7 Cart Screen
**Purpose**: Review cart items, select fulfillment method, proceed to checkout

**Layout** (with items):
```
┌─────────────────────────────────────────┐
│  Your Order (text-4xl, Poppins-Bold)    │
│                                         │
│  ┌─ Delivery or Pickup? ──────────────┐ │
│  │  [  Delivery  ]  [   Pickup   ]    │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Pad Thai             [−] 2 [+]  │   │
│  │ $15.90 each              Remove  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─ (sticky bottom) ─────────────────┐ │
│  │ Subtotal            $XX.XX        │ │
│  │ Delivery Fee            $5.00     │ │
│  │ ─────────────────────────────     │ │
│  │ Total             $XX.XX          │ │
│  │                                     │ │
│  │  [Proceed to Checkout]             │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Layout** (empty cart):
```
┌─────────────────────────────────────────┐
│     Your Cart is Empty (h2)             │
│     "Looks like you haven't added any   │
│      Thai delicacies yet."              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Browse Menu                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Components**: Custom layout, `Typography`, `ScrollView`, `StyleSheet`

**State Management**: `useCartStore` -- `items`, `updateQuantity`, `removeItem`, `getTotal`, `fulfillmentMethod`

**Constants**: `DELIVERY_FEE = 5.00`

**Calculations**:
- `total = sum(item.price * item.quantity)`
- `deliveryFee = fulfillment === 'delivery' ? 5.00 : 0`
- `finalTotal = total + deliveryFee`

---

### 3.8 Checkout Screen
**Purpose**: Finalize order with address, loyalty points, review, and payment

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back to Cart                         │
│  Your Order (text-4xl, Poppins-Bold)    │
│                                         │
│  ┌─ Fulfillment Method ─────────────┐   │
│  │  Delivery or Pickup    Delivery  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  {fulfillment === 'delivery' && (       │
│  ┌─ Delivery Address ───────────────┐   │
│  │  123 George St, Sydney NSW 2000  │   │
│  │  "Change Address" (brand-primary) │   │
│  └──────────────────────────────────┘   │
│  )}                                     │
│                                         │
│  ┌─ Loyalty Points ─────────────────┐   │
│  │  Current Points    [100 pts]      │   │
│  │  Save up to $5.00 on this order  │   │
│  │              [Toggle Switch]      │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ Order Summary ──────────────────┐   │
│  │  Items Subtotal       $41.00     │   │
│  │  Delivery Fee          $5.00     │   │
│  │  {loyaltyDiscount}               │   │
│  │  ─────────────────────────────    │   │
│  │  Total Amount         $41.00     │   │
│  │                                     │   │
│  │  Points you'll earn: 41 pts        │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ (sticky bottom) ─────────────────┐ │
│  │  [Pay $41.00]                      │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Components**: `ScrollView`, custom cards, `Switch`, `Typography`, inline `ActivityIndicator`

**Calculations**:
- `subtotal = getTotal()`
- `deliveryFee = fulfillment === 'delivery' ? 5.00 : 0`
- `maxLoyaltyDiscount = loyaltyPoints * (5.00 / 100)`
- `loyaltyDiscount = useLoyaltyPoints ? min(maxLoyaltyDiscount, subtotal + deliveryFee) : 0`
- `total = (subtotal + deliveryFee) - loyaltyDiscount`
- `pointsToEarn = Math.floor(total * 1)`

**Interactions**:
- "Back to Cart" → `navigation.goBack()`
- Loyalty toggle → `setUseLoyaltyPoints(!)`
- "Pay" → Stripe payment flow

**API Dependencies**:
- `POST /payments/stripe` → Create payment intent
- `POST /orders/confirm` → Confirm order

**Security**:
- Cart total NOT sent to backend (backend calculates)
- Client-side price verification (1-cent tolerance)
- Max amount guard ($10,000)

**States**:
- Loading (profile): ActivityIndicator
- Processing: Button greyed with "Processing..."
- Error: Alert "Payment Failed"

---

### 3.9 Confirmation Screen
**Purpose**: Display order success and return to home

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│           (centered, p-6)               │
│                                         │
│     [✓] (4xl, emerald-500)              │
│     (w-20 h-20, bg-emerald-100,         │
│      rounded-full)                      │
│                                         │
│  Order Confirmed! (h1)                  │
│  "Your order is being prepared"         │
│                                         │
│  Order #ORD-1234                        │
│  Est. delivery: 25-30 min               │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Track Order                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    Back to Home                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Components**: `Typography`, `Button`

**Interactions**:
- "Track Order" → Navigate to OrderStatusDetailScreen
- "Back to Home" → Reset navigation to MainTabs

---

### 3.10 Order Status Detail Screen
**Purpose**: Real-time order tracking

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back          Order #ORD-1234        │
│                                         │
│  ┌─ Status Stepper ─────────────────┐   │
│  │ [Paid] → [Preparing] → [Ready]   │   │
│  │  (●)        (●)       (○)        │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Est. arrival: 15 mins (countdown)      │
│                                         │
│  ┌─ Order Details ──────────────────┐   │
│  │ Pad Thai x2              $31.80  │   │
│  │ Spring Rolls x1           $8.90  │   │
│  │ ─────────────────────────────    │   │
│  │ Total                 $40.70     │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ Support ────────────────────────┐   │
│  │ [Contact Restaurant] (ghost)     │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Components**: `StatusStepper`, `EstimatedTime`, `OrderDetailsCard`, `SupportButton`

**Interactions**:
- WebSocket `order_status_updated` → Move Stepper to next stage
- Push Notification → Alert user of status change

**API Dependencies**:
- `GET /api/v1/orders/{id}` → Initial state
- WebSocket → Subscribe to `order:{id}` channel

**Edge Cases**:
- Connection Lost: Show "Reconnecting..." banner, polling fallback

---

### 3.11 User Profile Screen
**Purpose**: Manage account, view history, handle privacy requests

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back          Profile                │
│                                         │
│  ┌─ Profile Header ─────────────────┐   │
│  │ [Avatar]                          │   │
│  │ Liam Wilson                       │   │
│  │ liam@email.com                    │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ Loyalty Card ───────────────────┐   │
│  │ Current Points: 1,250             │   │
│  │ (emerald-50 background)           │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ Order History ──────────────────┐   │
│  │ 2024-07-20  •  $45.50  •  Ready │   │
│  │ 2024-07-19  •  $32.00  •  Deliv  │   │
│  │ [View All Orders →]               │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ Privacy Section ────────────────┐   │
│  │ [Request Data Redaction]          │   │
│  │ [Delete Account] (danger)         │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Components**: `ProfileHeader`, `LoyaltyCard`, `OrderHistoryList`, `PrivacySection`

**Interactions**:
- "Delete Account" → "Danger" Confirmation Modal → `DELETE /api/v1/user/profile` → Clear JWT → Redirect to Login

**API Dependencies**:
- `GET /api/v1/user/profile` → User metadata and points
- `GET /api/v1/orders/history` → List of past orders

**Edge Cases**:
- No Order History: Show "You haven't ordered yet" illustration → "Order Now" CTA

---

## 4. Component Library (Shared)

### 4.1 Button Component
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
```

### 4.2 Input Field
```typescript
interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}
```

### 4.3 Card Component
```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'elevated' | 'flat';
  className?: string;
}
```

---

## 5. Accessibility

### 5.1 Screen Reader Support
- All interactive elements have accessible labels
- Dynamic announcements for status changes (WebSocket events)
- Proper focus management for modals and sheets

### 5.2 Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text and UI components
- Brand colors tested for WCAG AA compliance

### 5.3 Touch Targets
- Minimum 44x44 points for all interactive elements
- Adequate spacing between adjacent touch targets (8pt minimum)

---

## 6. Responsive Design

### 6.1 Breakpoints
- **Mobile**: 375px - 767px (iPhone SE to iPhone Pro Max)
- **Tablet**: 768px+ (iPad, iPad Pro) - Not currently supported

### 6.2 Layout Adaptation
- Single-column layout for mobile
- Fixed bottom tab bar (60px height)
- Full-width cards and buttons

---

## 7. Animation & Transitions

### 7.1 Page Transitions
- Stack Navigator: Slide from right (default iOS)
- Tab Navigator: Fade in/out

### 7.2 Micro-interactions
- Button press: `scale(0.98)` with 100ms duration
- Card tap: `scale(0.99)` with 50ms duration
- Loading: Spinning ActivityIndicator

### 7.3 Transitions
- Cart item add: Brief animation (item flies to cart icon)
- Status update: Pulse animation on status badge

---

## 8. Error Handling

### 8.1 Network Errors
- Show inline error message below failed component
- Retry button for failed API calls
- Offline banner at top of screen

### 8.2 API Errors
- Toast notifications for transient errors
- Alert dialogs for critical errors (payment failures)
- Graceful degradation (show cached data)

### 8.3 Validation Errors
- Inline field-level validation messages
- Form submission validation (show all errors at once)
- Clear error recovery paths

---

## 9. Traceability Matrix

| Requirement | Screen | Component |
|------------|--------|-----------|
| **UR-C01** (Browse Menu) | MenuScreen | FoodItemCard, CategoryPill |
| **UR-C02** (Place Order) | CheckoutScreen, ConfirmationScreen | CartScreen, StripePayment |
| **UR-C03** (Loyalty Points) | ProfileScreen, CheckoutScreen | LoyaltyCard, LoyaltyToggle |
| **UR-C04** (Manage Profile) | ProfileScreen, EditProfileScreen | ProfileHeader, OrderHistoryList |
| **UR-C05** (Guest Checkout) | AuthChoiceScreen, CheckoutScreen | GuestButton, AuthScreen |

---

## 10. Future Enhancements

### 10.1 Biometric Login
- Face ID / Touch ID support for quick authentication
- Fallback to email OTP if biometric fails

### 10.2 Multi-language
- Support for Thai, English, Mandarin
- RTL layout support (not required for current launch)

### 10.3 Dark Mode
- System preference detection
- Custom dark theme with brand colors adapted

### 10.4 Push Notifications
- Order status updates
- Promotional offers (opt-in)
- Loyalty point notifications

---

**This specification is binding for all Customer App implementation. No deviations without explicit approval from the project owner.**