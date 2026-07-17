# UX/UI Specification: Restaurant Mobile App
**Project:** authentic_th  
**Version:** 1.0  
**Status:** Draft  
**Traceability:** SDD Section 2, 6 | BRD UR-RO01, UR-RO02, UR-RO03

---

## 1. Design Philosophy

### 1.1 Core Principles
- **Speed First**: Restaurant staff operate in fast-paced environments. UI must enable quick actions with minimal taps.
- **Clarity Over Beauty**: Status indicators, order priorities, and action buttons must be immediately obvious.
- **Consistency**: Maintain visual language from Customer App (NativeWind, Typography, Button patterns) for unified brand experience.
- **Offline-Resilient**: UI should provide feedback even when network is slow (optimistic updates).

### 1.2 Target Users
- **Primary**: Restaurant owners and managers (tech-savvy, need efficiency)
- **Secondary**: Kitchen staff (may need simplified view in future)

### 1.3 Design System Tokens

#### Colors
```typescript
// Primary Actions
brand-primary: #4F46E5 (Indigo)
brand-secondary: #7C3AED (Purple)
brand-success: #10B981 (Emerald)
brand-warning: #F59E0B (Amber)
brand-danger: #EF4444 (Red)

// Neutral
neutral-50: #F9FAFB
neutral-100: #F3F4F6
neutral-200: #E5E7EB
neutral-800: #1F2937
neutral-900: #111827
```

#### Typography Scale
```typescript
h1: 24px, Bold (Screen Titles)
h2: 20px, SemiBold (Section Headers)
h3: 18px, Medium (Card Titles)
body: 16px, Regular (Main Content)
caption: 14px, Regular (Secondary Info)
small: 12px, Regular (Labels, Timestamps)
```

#### Spacing Scale
- Base unit: 4px
- Common: 4, 8, 12, 16, 24, 32, 48, 64

---

## 2. Navigation Structure

### 2.1 Main Navigation (Bottom Tab Bar)
```
┌─────────────────────────────────────────┐
│  [Orders]  [Menu]  [Analytics]  [Profile]  │
└─────────────────────────────────────────┘
```

**Tab Icons**:
- Orders: `Package` (lucide-react-native)
- Menu: `UtensilsCrossed`
- Analytics: `BarChart3`
- Profile: `UserCircle`

**Active Tab Indicator**: Brand-primary color with 2px underline

### 2.2 Navigation Flow
```
Splash → Login → MainTabs (Orders | Menu | Analytics | Profile)
                                ↓
                    OrderDetail (Stack)
                    MenuEdit (Stack)
                    AnalyticsDetail (Stack)
                    ProfileEdit (Stack)
```

---

## 3. Screen Specifications

### 3.1 Splash Screen
**Purpose**: Brand introduction during authentication

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│            [Restaurant Logo]             │
│                                         │
│        Restaurant Name                  │
│        Tagline/Slogan                   │
│                                         │
│           [ActivityIndicator]           │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior**:
- Display for 1.5 seconds minimum
- Generate mock JWT token
- Transition to Login or MainTabs if valid session exists

**Components**: `StoreLogo`, `Typography`

---

### 3.2 Login Screen
**Purpose**: Authenticate restaurant owner

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│     Restaurant Login                    │
│     Sign in to manage your store        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Email                           │   │
│  │ _____________________________   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Password                        │   │
│  │ _____________________________   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Sign In                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Forgot password?                       │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- `TextInput` (email, password)
- `Button` (primary, full-width)
- `Typography` (labels, headings)

**Validation**:
- Email: Valid email format
- Password: Minimum 8 characters

**States**:
- Loading: Button shows spinner
- Error: Red error message below button
- Success: Navigate to MainTabs

---

### 3.3 Orders Screen (Home)
**Purpose**: Display active and recent orders

**Layout**:
```
┌─────────────────────────────────────────┐
│  My Orders              [Filter▼]       │
│                                         │
│  ┌─ Active Orders (3) ──────────────┐  │
│  │                                   │  │
│  │  ┌───────────────────────────┐   │  │
│  │  │ ORD-1001      [Pending]   │   │  │
│  │  │ Pad Thai x2, Spring Rolls │   │  │
│  │  │ $45.50  •  2 min ago      │   │  │
│  │  │                           │   │  │
│  │  │ [Accept] [Details →]      │   │  │
│  │  └───────────────────────────┘   │  │
│  │                                   │  │
│  │  ┌───────────────────────────┐   │  │
│  │  │ ORD-1002      [Accepted]  │   │  │
│  │  │ Tom Yum Soup x1           │   │  │
│  │  │ $16.00  •  5 min ago      │   │  │
│  │  │                           │   │  │
│  │  │ [Prepare] [Details →]     │   │  │
│  │  └───────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─ Recent Orders (2) ──────────────┐  │
│  │  ┌───────────────────────────┐   │  │
│  │  │ ORD-998       [Completed] │   │  │
│  │  │ Family Platter            │   │  │
│  │  │ $68.20  •  Oct 20         │   │  │
│  │  └───────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- `OrderCard` (custom component)
- `OrderStatusBadge` (color-coded)
- `Button` (action buttons)

**Order Status Badge Colors**:
- Pending: `bg-orange-100 text-orange-600`
- Accepted: `bg-blue-100 text-blue-600`
- Preparing: `bg-yellow-100 text-yellow-600`
- Ready: `bg-green-100 text-green-600`
- Completed: `bg-gray-100 text-gray-600`
- Cancelled: `bg-red-100 text-red-600`

**Behavior**:
- Pull-to-refresh to reload orders
- Tap order → Navigate to OrderDetail
- Tap "Accept" → Show confirmation dialog → Update status
- Filter: All | Active | Completed

---

### 3.4 Order Detail Screen
**Purpose**: View full order details and update status

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back       Order #ORD-1001           │
│                                         │
│  ┌─ Order Status ───────────────────┐  │
│  │  [Pending]                        │  │
│  │  Updated 2 min ago                │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Order Items ────────────────────┐  │
│  │  Pad Thai              x2   $31.00│  │
│  │  Spring Rolls          x1   $10.00│  │
│  │  ─────────────────────────────    │  │
│  │  Subtotal                    $41.00│  │
│  │  Delivery Fee                 $5.00│  │
│  │  ─────────────────────────────    │  │
│  │  Total                     $46.00 │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Customer Info ──────────────────┐  │
│  │  John Smith                       │  │
│  │  04XX XXX XXX                     │  │
│  │  123 Maple St, Sydney NSW 2000    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Special Notes ──────────────────┐  │
│  │  No spicy, extra sauce please    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Actions ────────────────────────┐  │
│  │  [Accept Order]                   │  │
│  │  (or [Prepare] if already accepted)│ │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- `Typography` (labels, values)
- `Button` (action, full-width)
- `View` (cards with border)

**Action Buttons** (based on status):
- Pending: "Accept Order" (primary, brand-primary)
- Accepted: "Start Preparing" (primary, brand-primary)
- Preparing: "Mark as Ready" (primary, brand-success)
- Ready: "Complete Order" (primary, brand-success)

**Behavior**:
- Tap action button → Show confirmation dialog
- Confirm → API call → Update UI → Show success alert
- Loading state during API call

---

### 3.5 Menu Screen
**Purpose**: Manage product catalog and availability

**Layout**:
```
┌─────────────────────────────────────────┐
│  Menu Management          [Edit]        │
│                                         │
│  ┌─ Appetizers (5) ──────────────────┐ │
│  │  ┌───────────────────────────┐    │ │
│  │  │ Spring Rolls    [Available]│    │ │
│  │  │ $10.00  •  5 min prep    │    │ │
│  │  │ ──────────────────────── │    │ │
│  │  │ [Edit] [Toggle]          │    │ │
│  │  └───────────────────────────┘    │ │
│  │  ┌───────────────────────────┐    │ │
│  │  │ Satay Chicken   [Available]│   │ │
│  │  │ $12.00  •  8 min prep    │    │ │
│  │  │ ──────────────────────── │    │ │
│  │  │ [Edit] [Toggle]          │    │ │
│  │  └───────────────────────────┘    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌─ Mains (8) ──────────────────────┐ │
│  │  ... similar structure            │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- `MenuItemCard` (custom component)
- `ToggleSwitch` (availability)
- `Button` (edit, toggle)

**MenuItem Card Layout**:
```
┌─────────────────────────────────────┐
│  Item Name              [Available] │
│  $XX.XX  •  XX min prep            │
│                                     │
│  [Edit]    [Toggle Availability]    │
└─────────────────────────────────────┘
```

**Behavior**:
- Tap "Edit" → Navigate to EditItemScreen
- Tap "Toggle" → Show confirmation → Update availability
- Pull-to-refresh to reload menu

---

### 3.6 Edit Menu Item Screen
**Purpose**: Update item details, price, and availability

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back       Edit Menu Item           │
│                                         │
│  ┌─ Item Details ───────────────────┐  │
│  │                                   │  │
│  │  Name                             │  │
│  │  _____________________________    │  │
│  │                                   │  │
│  │  Description                      │  │
│  │  _____________________________    │  │
│  │  _____________________________    │  │
│  │                                   │  │
│  │  Price ($)                        │  │
│  │  _____________________________    │  │
│  │                                   │  │
│  │  Preparation Time (minutes)       │  │
│  │  _____________________________    │  │
│  │                                   │  │
│  │  [Toggle: Available/Unavailable]  │  │
│  │                                   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Actions ────────────────────────┐  │
│  │  [Save Changes]                   │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- `TextInput` (name, description, price, time)
- `ToggleSwitch` (availability)
- `Button` (save, cancel)

**Validation**:
- Name: Required, max 100 chars
- Price: Required, positive number, max 2 decimal places
- Time: Required, positive integer, max 60 minutes

---

### 3.7 Analytics Screen
**Purpose**: View sales performance and trends

**Layout**:
```
┌─────────────────────────────────────────┐
│  Analytics              [Period▼]       │
│                                         │
│  ┌─ Today ──────────────────────────┐  │
│  │  Revenue        Orders           │  │
│  │  $1,250.00    28                │  │
│  │  ▲ 12%           ▲ 5             │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Average Order Value ────────────┐  │
│  │  $44.64                           │  │
│  │  ▲ 3%                             │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Revenue Chart ──────────────────┐  │
│  │  [Bar Chart Visualization]       │  │
│  │  Jan  Feb  Mar  Apr  May  Jun    │  │
│  │  ████ ████ ████ ████ ████ ████   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Popular Items ──────────────────┐  │
│  │  1. Pad Thai          45 sold    │  │
│  │  2. Green Curry       38 sold    │  │
│  │  3. Tom Yum Soup      32 sold    │  │
│  │  4. Massaman Curry    28 sold    │  │
│  │  5. Mango Sticky Rice 25 sold    │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- `SummaryCard` (revenue, orders, AOV)
- `ChartView` (revenue trend - using `react-native-chart-kit`)
- `PopularItemRow` (ranked list)

**Behavior**:
- Period selector: Today | Week | Month
- Pull-to-refresh to reload data
- Tap item in popular list → View item details (future)

---

### 3.8 Profile Screen
**Purpose**: View and edit restaurant owner profile

**Layout**:
```
┌─────────────────────────────────────────┐
│  Profile                   [Edit]       │
│                                         │
│  ┌─ Account Details ──────────────────┐ │
│  │  John Smith                         │ │
│  │  john@siamauthentic.com             │ │
│  │  04XX XXX XXX                       │ │
│  │                                     │ │
│  │  Role: Restaurant Owner             │ │
│  │  Tenant: Siam Authentic             │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─ Settings ────────────────────────┐  │
│  │  [Notification Preferences]   →   │  │
│  │  [Printer Configuration]      →   │  │
│  │  [Subscription Plan]          →   │  │
│  │  [Help & Support]             →   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Account ────────────────────────┐  │
│  │  [Logout]                         │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Components**:
- `ProfileSection` (card with title and content)
- `SettingRow` (tappable row with arrow)
- `Button` (logout, danger variant)

**Behavior**:
- Tap "Edit" → Navigate to EditProfileScreen
- Tap setting row → Navigate to respective screen (future)
- Tap "Logout" → Show confirmation → Clear session → Navigate to Login

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

**Styles**:
- Primary: `bg-brand-primary text-white`
- Secondary: `border-2 border-brand-primary text-brand-primary bg-transparent`
- Ghost: `text-zinc-600 bg-transparent`
- Danger: `bg-rose-500 text-white`

### 4.2 OrderCard Component
```typescript
interface OrderCardProps {
  order: Order;
  onPress: () => void;
  onAccept?: () => void;
  onPrepare?: () => void;
  showActions?: boolean;
}
```

### 4.3 MenuItemCard Component
```typescript
interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: () => void;
  onToggle?: () => void;
  showActions?: boolean;
}
```

### 4.4 OrderStatusBadge Component
```typescript
interface OrderStatusBadgeProps {
  status: OrderStatus;
}
```

---

## 5. Interaction Patterns

### 5.1 Confirmation Dialogs
Used for destructive or important actions:
- Accept Order
- Toggle Item Availability
- Logout

**Pattern**:
```
┌─────────────────────────────────┐
│  Confirm Action                 │
│                                 │
│  Are you sure you want to       │
│  accept this order?             │
│                                 │
│  [Cancel]      [Confirm]        │
└─────────────────────────────────┘
```

### 5.2 Loading States
- **Screen Loading**: Centered ActivityIndicator
- **Button Loading**: Spinner inside button, disabled state
- **Pull-to-Refresh**: Native refresh indicator

### 5.3 Empty States
When no data is available:
```
┌─────────────────────────────────┐
│                                 │
│      [Icon]                     │
│                                 │
│  No orders found                │
│  New orders will appear here    │
│                                 │
└─────────────────────────────────┘
```

### 5.4 Error States
- **Inline Error**: Red text below input field
- **Alert Error**: Alert dialog for critical errors
- **Snackbar**: Bottom notification for non-critical errors

---

## 6. Responsive Design

### 6.1 Supported Devices
- iPhone SE (4.7") and above
- iPhone 12/13/14/15 (6.1" and 6.7")
- iPod Touch (7th gen)
- Android devices (4.7" and above)

### 6.2 Orientation
- Portrait only (primary)
- No landscape support required

### 6.3 Safe Area Handling
- Use `GlobalSafeWrapper` component
- Respect notch, Dynamic Island, home indicator

---

## 7. Accessibility

### 7.1 Color Contrast
- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Status badges use both color and text labels

### 7.2 Touch Targets
- Minimum touch target size: 44x44 points
- Adequate spacing between interactive elements

### 7.3 Screen Reader Support
- All interactive elements have accessibility labels
- Status badges include descriptive labels (e.g., "Order status: Pending")

---

## 8. Animations & Transitions

### 8.1 Page Transitions
- Stack navigation: Slide from right (standard React Navigation)
- Tab switching: Fade or slide (standard)

### 8.2 Micro-interactions
- Button press: Scale down to 0.98, return on release
- Toggle switch: Smooth slide animation
- Order status change: Fade in new status badge

### 8.3 Loading Animations
- Skeleton screens for list items (future enhancement)
- Spinner for button loading states

---

## 9. Asset Requirements

### 9.1 Icons (lucide-react-native)
- `Package` - Orders tab
- `UtensilsCrossed` - Menu tab
- `BarChart3` - Analytics tab
- `UserCircle` - Profile tab
- `ChevronRight` - Navigation arrows
- `AlertCircle` - Error states
- `CheckCircle` - Success states

### 9.2 Images
- Restaurant logo (white-label config)
- No additional static images required for MVP

---

## 10. Traceability Matrix

| Requirement | Screen | Component | Interaction |
|-------------|--------|-----------|-------------|
| UR-RO01 (Menu) | MenuScreen, EditItemScreen | MenuItemCard, TextInput | Toggle availability, edit price |
| UR-RO02 (Orders) | OrdersScreen, OrderDetailScreen | OrderCard, OrderStatusBadge | Accept, prepare, complete |
| UR-RO03 (Sales) | AnalyticsScreen | SummaryCard, ChartView | Period selector, view trends |
| BMR-001 (Multi-tenant) | All screens | TenantInfo in profile | Display tenant name |
| BOR-002 (Printer) | OrderDetailScreen | Status badges | Status changes trigger print |

---

## 11. Future Enhancements (Not in MVP)

- **Kitchen Display System**: Simplified view for kitchen staff
- **Push Notifications**: Real-time order alerts
- **Offline Mode**: Cache orders and menu for offline use
- **Multi-language**: Support for Thai, English, Mandarin
- **Dark Mode**: System-aware or manual toggle
- **Biometric Login**: Face ID / Touch ID support

---

**End of UX/UI Specification**