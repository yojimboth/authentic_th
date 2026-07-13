# Screen-by-Screen Specifications: authentic_th

This document provides the final high-fidelity blueprints for the implementation of the `authentic_th` ecosystem. It translates the **BRD**, **SAD**, and **SDDs** into a precise set of UI components, interactions, and API dependencies.

---

## 📱 1. Customer Mobile App
**Design Persona**: "Invisible Friction" | **Primary Color**: `brand-orange` (#FF6B00) | **Font**: Poppins (Headings), Inter (Body)

### Screen 1.1: Menu Home
*   **Goal**: Enable customers to discover food items and navigate categories with zero friction.
*   **Requirements Mapping**: `UR-C01`
*   **UI Elements**:
    *   `SearchBar`: Input $\rightarrow$ "Search for your favorite dish..." $\rightarrow$ Real-time filter on `FoodItemList`.
    *   `CategoryScroll`: Horizontal List $\rightarrow$ Item Labels (e.g., "Main Course", "Drinks") $\rightarrow$ Switches active category.
    *   `FoodItemList`: Grid/List $\rightarrow$ `FoodItemCard` $\rightarrow$ Displays `name`, `price`, `imageUrl`.
    *   `CartFloatingButton`: Button $\rightarrow$ Icon: Shopping Cart + Badge (Count) $\rightarrow$ Navigates to Cart.
*   **Interactions**:
    *   *Tap Category* $\rightarrow$ Filter local `FoodItemList` state $\rightarrow$ Scroll to top of list.
    *   *Tap FoodItemCard* $\rightarrow$ Navigate to `Item Detail` screen.
    *   *Type in Search* $\rightarrow$ Filter items matching `name` or `description` $\rightarrow$ Update list view.
*   **API Dependencies**:
    *   `GET /api/v1/menu` $\rightarrow$ Populate categories and item list.
*   **Edge Cases**:
    *   `Empty Search Results`: Show "No dishes found" illustration + "Clear Search" button.
    *   `Loading`: Show Skeleton cards in the `FoodItemList` grid.

### Screen 1.2: Item Detail
*   **Goal**: Allow customers to customize their meal and add it to the cart.
*   **Requirements Mapping**: `UR-C01`
*   **UI Elements**:
    *   `HeroImage`: Image $\rightarrow$ `FoodItem.imageUrl` $\rightarrow$ Aspect Ratio 1:1, rounded-b-3xl.
    *   `ItemHeader`: Text $\rightarrow$ `name` (h1), `description` (body) $\rightarrow$ Static.
    *   `ModifierGroup`: Section $\rightarrow$ Title (e.g., "Spiciness Level") $\rightarrow$ Radio Button list (e.g., "Mild", "Medium", "Thai Spicy").
    *   `QuantityStepper`: Component $\rightarrow$ [-] `value` [+] $\rightarrow$ Updates `cartQuantity`.
    *   `AddToCartButton`: Button $\rightarrow$ "Add to Cart - $[Price]" $\rightarrow$ Behavior: Primary.
*   **Interactions**:
    *   *Select Modifier* $\rightarrow$ Update local `selectionState` $\rightarrow$ Recalculate total price if modifier has cost.
    *   *Click Add to Cart* $\rightarrow$ `Zustand: cartStore.addItem()` $\rightarrow$ Show "Added to Cart" Toast $\rightarrow$ Navigate back to Menu.
*   **API Dependencies**:
    *   `GET /api/v1/menu/{id}` $\rightarrow$ Populate item specifics and available modifiers.
* **Edge Cases**:
    *   `Item Out of Stock`: Replace `AddToCartButton` with "Currently Unavailable" (Disabled).

### Screen 1.3: Cart & Checkout
*   **Goal**: Review order, apply loyalty rewards, and execute payment via Stripe.
*   **Requirements Mapping**: `UR-C02`, `UR-C03`, `UR-C05`
*   **UI Elements**:
    *   `CartList`: List $\rightarrow$ `CartItem` rows $\rightarrow$ Show name, selected modifiers, qty, and "Remove" icon.
    *   `AddressInput`: Input $\rightarrow$ "Delivery Address" $\rightarrow$ Text field with validation.
    *   `LoyaltyToggle`: Switch $\rightarrow$ "Redeem Loyalty Points" $\rightarrow$ Label shows points available.
    *   `OrderSummary`: Card $\rightarrow$ Subtotal, Tax, Total $\rightarrow$ Dynamic update on toggle.
    *   `PayNowButton`: Button $\rightarrow$ "Pay Now" $\rightarrow$ Behavior: Primary.
*   **Interactions**:
    *   *Toggle Loyalty* $\rightarrow$ `POST /api/v1/loyalty/calculate-discount` $\rightarrow$ Update `OrderSummary.total`.
    *   *Click Pay Now* $\rightarrow$ `POST /api/v1/payments/stripe` $\rightarrow$ Open Stripe Payment Sheet $\rightarrow$ On Success $\rightarrow$ `POST /api/v1/orders/confirm`.
*   **API Dependencies**:
    *   `GET /api/v1/user/profile` $\rightarrow$ Retrieve current loyalty balance.
    *   `POST /api/v1/payments/stripe` $\rightarrow$ Get `client_secret` for Stripe SDK.
*   **Edge Cases**:
    *   `Payment Declined`: Show Error Toast "Payment failed, please try another card" $\rightarrow$ Keep user on Checkout screen.

### Screen 1.4: Order Tracking
*   **Goal**: provide real-time visibility into order progress.
*   **Requirements Mapping**: `UR-C02`
*   **UI Elements**:
    *   `StatusStepper`: Visual Component $\rightarrow$ Steps: [Paid] $\rightarrow$ [Preparing] $\rightarrow$ [Ready/Out] $\rightarrow$ [Completed].
    *   `EstimatedTime`: Text $\rightarrow$ "Est. arrival: 15 mins" $\rightarrow$ Dynamic countdown.
    *   `OrderDetailsCard`: Card $\rightarrow$ List of items ordered $\rightarrow$ Read-only.
    *   `SupportButton`: Button $\rightarrow$ "Contact Restaurant" $\rightarrow$ Ghost variant.
*   **Interactions**:
    *   *WebSocket Event* $\rightarrow$ `order_status_updated` $\rightarrow$ Move Stepper to next stage $\rightarrow$ Trigger Push Notification.
*   **API Dependencies**:
    *   `GET /api/v1/orders/{id}` $\rightarrow$ Initial state load.
    *   WebSocket Connection $\rightarrow$ Subscription to `order:{id}` channel.
*   **Edge Cases**:
    *   `Connection Lost`: Show "Reconnecting..." banner $\rightarrow$ Attempt polling fallback.

### Screen 1.5: User Profile
*   **Goal**: Manage account, view history, and handle privacy requests.
*   **Requirements Mapping**: `UR-C04`, `BOR-001`
*   **UI Elements**:
    *   `ProfileHeader`: Layout $\rightarrow$ Avatar + `fullName` + `email`.
    *   `LoyaltyCard`: Elevated Card $\rightarrow$ "Current Points: [X]" $\rightarrow$ Primary accent background.
    *   `OrderHistoryList`: List $\rightarrow$ Item: [Date | Total | Status] $\rightarrow$ Navigates to order detail.
    *   `PrivacySection`: Menu $\rightarrow$ "Request Data Redaction" / "Delete Account" $\rightarrow$ Danger variant.
*   **Interactions**:
    *   *Click "Delete Account"* $\rightarrow$ Show "Danger" Confirmation Modal $\rightarrow$ `DELETE /api/v1/user/profile` $\rightarrow$ Clear JWT $\rightarrow$ Redirect to Login.
*   **API Dependencies**:
    *   `GET /api/v1/user/profile` $\rightarrow$ User metadata and points.
    *   `GET /api/v1/orders/history` $\rightarrow$ List of past orders.
* **Edge Cases**:
    *   `No Order History`: Show "You haven't ordered yet" illustration $\rightarrow$ "Order Now" CTA.

---

## 🍳 2. Restaurant Mobile App
**Design Persona**: "Operational Velocity" | **Primary Color**: `brand-teal` (#008080) | **Font**: Inter (All)

### Screen 2.1: Order Management (Active)
*   **Goal**: Process incoming orders with maximum speed and minimal error.
*   **Requirements Mapping**: `UR-RO02`
*   **UI Elements**:
    *   `OrderQueue`: List $\rightarrow$ `OrderCard` $\rightarrow$ Layout: [Time Elapsed | Order ID | Items List | Total].
    *   `StatusBadge`: Badge $\rightarrow$ "Paid", "Preparing", "Ready" $\rightarrow$ Color-coded.
    *   `ActionButtons`: Row $\rightarrow$ "Accept", "Mark Ready", "Mark Complete" $\rightarrow$ Large, high-contrast buttons.
*   **Interactions**:
    *   *New Order Event* $\rightarrow$ OrderCard appears at top with alert sound $\rightarrow$ State: `Paid`.
    *   *Click "Accept"* $\rightarrow$ `PATCH /api/v1/orders/{id}` (status: Preparing) $\rightarrow$ Move to "Preparing" column/section.
    *   *Click "Mark Ready"* $\rightarrow$ `PATCH /api/v1/orders/{id}` (status: Ready) $\rightarrow$ Trigger Customer Notification.
*   **API Dependencies**:
    *   `PATCH /api/v1/orders/{id}` $\rightarrow$ Update order state.
    *   WebSocket $\rightarrow$ Listen for `order_created` events.
* **Edge Cases**:
    *   `Order Timeout`: If order is not accepted within 5 mins, highlight card in `rose-500` (Danger).

### Screen 2.2: Menu Editor
*   **Goal**: Rapidly update menu availability and pricing.
*   **Requirements Mapping**: `UR-RO01`
*   **UI Elements**:
    *   `CategoryFilter`: TabBar $\rightarrow$ "Mains", "Sides", "Drinks" $\rightarrow$ Filters list.
    *   `MenuItemRow`: Row $\rightarrow$ [Item Name | Price | Availability Toggle].
    *   `AddItemButton`: FloatingActionButton $\rightarrow$ Icon: Plus $\rightarrow$ Opens "New Item" Bottom-sheet.
    *   `SaveButton`: Button $\rightarrow$ "Save All Changes" $\rightarrow$ Primary.
*   **Interactions**:
    *   *Toggle Availability* $\rightarrow$ `PATCH /api/v1/menus/{id}` (is_available: bool) $\rightarrow$ Immediate update in UI.
    *   *Edit Price* $\rightarrow$ Tap Price $\rightarrow$ Numeric Input $\rightarrow$ Update local state $\rightarrow$ `PUT /api/v1/menus/{id}`.
* **API Dependencies**:
    *   `GET /api/v1/menus` $\rightarrow$ Load full catalog.
    *   `PATCH/PUT /api/v1/menus/{id}` $\rightarrow$ Persist changes.
* **Edge Cases**:
    *   `Network Error`: Show "Changes not saved" toast $\rightarrow$ Keep local state for retry.

### Screen 2.3: Performance Dashboard
*   **Goal**: High-level visibility of business health using KPIs.
*   **Requirements Mapping**: `UR-RO03`
*   **UI Elements**:
    *   `KPITiles`: Grid $\rightarrow$ [Total Revenue | Total Orders | Avg. Order Value] $\rightarrow$ High-contrast labels.
    *   `DateRangePicker`: Component $\rightarrow$ "Today", "Last 7 Days", "Custom" $\rightarrow$ Filter data.
    *   `TopItemsList`: Table $\rightarrow$ [Item Name | Units Sold | Revenue] $\rightarrow$ Sorted by volume.
* **Interactions**:
    *   *Change Date Range* $\rightarrow$ `GET /api/v1/analytics?start=...&end=...` $\rightarrow$ Refresh all tiles and lists.
* **API Dependencies**:
    *   `GET /api/v1/analytics/summary` $\rightarrow$ Populate KPI tiles.
    *   `GET /api/v1/analytics/top-items` $\rightarrow$ Populate top items list.
* **Edge Cases**:
    *   `New Store (No Data)`: Show "No data available for this period" $\rightarrow$ "Start selling!" CTA.

### Screen 2.4: Printer Settings
*   **Goal**: Ensure reliable cloud-to-local order printing.
* **Requirements Mapping**: `BOR-002`
* **UI Elements**:
    *   `PrinterStatusIndicator`: Badge $\rightarrow$ "Connected" (Green) / "Disconnected" (Red).
    *   `IPConfigInput`: Input $\rightarrow$ "Relay IP Address" $\rightarrow$ Text field.
    *   `TestPrintButton`: Button $\rightarrow$ "Send Test Print" $\rightarrow$ Secondary variant.
    *   `ConfigSaveButton`: Button $\rightarrow$ "Save Configuration" $\rightarrow$ Primary.
* **Interactions**:
    *   *Click "Test Print"* $\rightarrow$ `POST /api/v1/printers/test` $\rightarrow$ Show loading spinner $\rightarrow$ Toast: "Test signal sent".
    *   *Save Config* $\rightarrow$ `PATCH /api/v1/tenants/{id}/config` $\rightarrow$ Update printer IP in DB.
* **API Dependencies**:
    *   `POST /api/v1/printers/test` $\rightarrow$ Trigger relay event.
    *   `PATCH /api/v1/tenants/{id}/config` $\rightarrow$ Update store config.
* **Edge Cases**:
    *   `Printer Offline`: If test print fails $\rightarrow$ Show "Printer not responding. Check local power/network."

### Screen 2.5: Business Profile
*   **Goal**: Manage store identity and operational hours.
* **Requirements Mapping**: `UR-RO01`
* **UI Elements**:
    *   `LogoUploader`: Component $\rightarrow$ Image Circle + "Change" button $\rightarrow$ Opens gallery.
    *   `StoreInfoForm`: Form $\rightarrow$ [Store Name | Address | Phone Number].
    *   `OperatingHoursList`: List $\rightarrow$ [Day | Open Time | Close Time] $\rightarrow$ Time-picker inputs.
    *   `UpdateProfileButton`: Button $\rightarrow$ "Update Profile" $\rightarrow$ Primary.
* **Interactions**:
    *   *Update Hours* $\rightarrow$ `PATCH /api/v1/tenants/{id}/config` $\rightarrow$ Success Toast.
* **API Dependencies**:
    *   `GET /api/v1/tenants/{id}/config` $\rightarrow$ Load current profile.
    *   `PATCH /api/v1/tenants/{id}/config` $\rightarrow$ Save profile.
* **Edge Cases**:
    *   `Invalid Phone Format`: Red border on phone input $\rightarrow$ Caption: "Please enter a valid Australian phone number."

---

## 💻 3. System Admin Web Portal
**Design Persona**: "Governance & Clarity" | **Primary Color**: `brand-indigo` (#4F46E5) | **Font**: Inter (All)

### Screen 3.1: Global Dashboard
*   **Goal**: Monitoring the entire ecosystem health and financial performance.
* **Requirements Mapping**: `UR-A03`, `BMR-005`
* **UI Elements**:
    *   `GlobalKPIs`: Grid $\rightarrow$ [Total GMV | Active Tenants | Platform Revenue | System Latency].
    *   `SystemHealthChart`: Line Chart $\rightarrow$ API Latency vs. Time $\rightarrow$ Color changes to red if $>500\text{ms}$.
    *   `TenantAlertFeed`: List $\rightarrow$ "Tenant [X] is exceeding rate limits" $\rightarrow$ Action: "View Tenant".
* **Interactions**:
    *   *Click Alert* $\rightarrow$ Navigate to `Tenant Management` $\rightarrow$ Filter by specific `tenant_id`.
* **API Dependencies**:
    *   `GET /api/v1/governance/health/summary` $\rightarrow$ Populate health metrics.
    *   `GET /api/v1/governance/metrics/global` $\rightarrow$ Populate GMV and aggregate data.
* **Edge Cases**:
    *   `Critical System Failure`: Whole dashboard background shifts to `rose-50` with a "System Alert" banner at top.

### Screen 3.2: Tenant Management
*   **Goal**: Control the lifecycle of restaurants on the platform.
* **Requirements Mapping**: `UR-A01`
* **UI Elements**:
    *   `TenantDataTable`: Table $\rightarrow$ Columns: [Restaurant Name | Domain | Status | Plan | Actions].
    *   `AddTenantButton`: Button $\rightarrow$ "Add New Tenant" $\rightarrow$ Primary.
    *   `ActionMenu`: Dropdown $\rightarrow$ [Edit Config | Suspend | Activate | Delete].
    *   `StatusBadge`: Badge $\rightarrow$ "Active" (Green) / "Suspended" (Red) / "Pending" (Amber).
* **Interactions**:
    *   *Click "Suspend"* $\rightarrow$ Confirmation Modal $\rightarrow$ `POST /api/v1/tenants/{id}/suspend` $\rightarrow$ Update badge to "Suspended" (Optimistic update).
    *   *Click "Add Tenant"* $\rightarrow$ Open registration modal $\rightarrow$ `POST /api/v1/tenants` $\rightarrow$ Navigate to Tenant Detail.
* **API Dependencies**:
    *   `GET /api/v1/tenants` $\rightarrow$ Populate table.
    *   `POST /api/v1/tenants/{id}/suspend` $\rightarrow$ Execute suspension.
* **Edge Cases**:
    *   `Deleting Active Tenant`: Show "Heavy Warning" modal stating that all current orders will be cancelled.

### Screen 3.3: Billing Configuration
*   **Goal**: Define the platform's fee structure and revenue model.
* **Requirements Mapping**: `BMR-003`
* **UI Elements**:
    *   `FeeTypeSelector`: Dropdown $\rightarrow$ "Fixed Fee" / "Percentage Fee".
    *   `FeeValueInput`: Input $\rightarrow$ Numeric $\rightarrow$ Currency label (AUD).
    *   `RevenuePreview`: Card $\rightarrow$ "Projected Monthly Revenue: $[X]" $\rightarrow$ Updates in real-time.
    *   `ApplyGlobalButton`: Button $\rightarrow$ "Apply to All Tenants" $\rightarrow$ Primary.
* **Interactions**:
    *   *Change Fee Value* $\rightarrow$ `POST /api/v1/governance/billing/validate` $\rightarrow$ Update `RevenuePreview`.
    *   *Click Apply* $\rightarrow$ `PUT /api/v1/governance/billing/global` $\rightarrow$ Success Toast + Audit Log entry.
* **API Dependencies**:
    *   `GET /api/v1/governance/billing` $\rightarrow$ Load current fees.
    * `PUT /api/v1/governance/billing/global` $\rightarrow$ Update fee structure.
* **Edge Cases**:
    *   `Negative Fee`: Validation error $\rightarrow$ Shake animation on input field + red border.

### Screen 3.4: Loyalty Governance
*   **Goal**: Set the global rules for the point system across all tenants.
* **Requirements Mapping**: `UR-A02`
* **UI Elements**:
    *   `ConversionRateInput`: Input $\rightarrow$ "1 Point = $[X] AUD" $\rightarrow$ Numeric.
    *   `OverrideToggle`: Switch $\rightarrow$ "Allow Restaurants to Override Rates" $\rightarrow$ Boolean.
    *   `PolicySummary`: Box $\rightarrow$ "Current Policy: Users earn 1 point per $1 spent. Stores can either adjust." $\rightarrow$ Fixed text.
    *   `SavePolicyButton`: Button $\rightarrow$ "Save Global Policy" $\rightarrow$ Primary.
* **Interactions**:
    *   *Click Save* $\rightarrow$ `PUT /api/v1/governance/loyalty/global` $\rightarrow$ Cache invalidation in Redis.
* **API Dependencies**:
    *   `GET /api/v1/governance/loyalty` $\rightarrow$ Load current rules.
    * `PUT /api/v1/governance/loyalty/global` $\rightarrow$ Update rules.
* **Edge Cases**:
    *   `Extreme Rate`: If rate is set to $>100\text{pt}/\$1$, show "Warning: This rate may cause inflation in loyalty points."

### Screen 3.5: Compliance Center
*   **Goal**: Manage PDPA requests and ensure legal data hygiene.
* **Requirements Mapping**: `BOR-001`
* **UI Elements**:
    *   `RequestQueueTable`: Table $\rightarrow$ Columns: [Request ID | User Email | Tenant | Request Type | Status].
    *   `RequestTypeBadge`: Badge $\rightarrow$ "Right to Access" (Blue) / "Right to be Forgotten" (Rose).
    *   `PurgeButton`: Button $\rightarrow$ "Execute Hard Purge" $\rightarrow$ Danger variant.
    *   `AuditExportButton`: Button $\rightarrow$ "Export Compliance Log" $\rightarrow$ Secondary.
* **Interactions**:
    *   *Click "Execute Hard Purge"* $\rightarrow$ Multi-step confirmation ("I confirm this is a PDPA request") $\rightarrow$ `POST /api/v1/governance/compliance/purge` $\rightarrow$ Show progress bar.
    * *Export Log* $\rightarrow$ `GET /api/v1/governance/compliance/export` $\rightarrow$ Trigger CSV download.
* **API Dependencies**:
    * `GET /api/v1/governance/compliance/requests` $\rightarrow$ Load queue.
    * `POST /api/v1/governance/compliance/purge` $\rightarrow$ Execute data deletion across all crates.
* **Edge Cases**:
    * `User Not Found`: If purge is triggered for a non-existent user $\rightarrow$ Show "Error: User record not found in any tenant database."
