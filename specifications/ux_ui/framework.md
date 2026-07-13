# UX/UI Specification Framework: authentic_th

This document establishes the **UX/UI Specification Framework** for the `authentic_th` ecosystem. It provides the standards, design language, and documentation methodology required to translate the Software Design Descriptions (SDDs) into high-fidelity interfaces.

## 1. Design Principles

To ensure the system meets the diverse needs of its three primary personas, the following guiding principles apply to each application:

### 📱 Customer Mobile App: "Invisible Friction"
*   **Simplicity First**: Minimize the steps from "App Open" to "Order Placed."
*   **Visual Appetite**: Prioritize high-quality imagery and clean layouts to highlight food items.
*   **Trust & Transparency**: Clear visibility of loyalty points, taxes, and order status at all times.

### 🍳 Restaurant Mobile App: "Operational Velocity"
*   **Glanceability**: Critical order information (Items, Special Instructions, Time Elapsed) must be readable from a distance.
*   **High-Contrast Action**: Primary actions (e.g., "Mark as Preparing," "Complete Order") must be large, accessible, and distinct.
*   **Noise Reduction**: Alerts should be urgent but not distracting; avoid cluttered screens during peak rush hours.

### 💻 System Admin Web Portal: "Governance & Clarity"
*   **Information Density**: Optimized for desktop screens to provide comprehensive data (tables/metrics) without excessive scrolling.
*   **Safety-First Interaction**: Destructive actions (e.g., "Suspend Tenant") must require explicit confirmation and clear warning.
*   **Auditability**: Every configuration change should feel consequential and logged.

---

## 2. Global Design System (The Foundation)

All applications will utilize **Tailwind CSS / NativeWind** for implementation.

### 2.1 Color Palette
The palette is divided by persona to provide an immediate mental context of which "mode" the user is in.

| Scale | Customer App (Vibrant/Fresh) | Restaurant App (Focused/Urgent) | Admin Portal (Professional/Stable) |
| :--- | :--- | :--- | :--- |
| **Primary** | `brand-orange` (#FF6B00) | `brand-teal` (#008080) | `brand-indigo` (#4F46E5) |
| **Secondary** | `brand-amber` (#F59E0B) | `brand-slate` (#64748B) | `brand-violet` (#7C3AED) |
| **Success** | `emerald-500` (#10B981) | `emerald-500` (#10B981) | `emerald-600` (#059669) |
| **Warning** | `amber-500` (#F59E0B) | `amber-500` (#F59E0B) | `amber-600` (#D97706) |
| **Danger** | `rose-500` (#F43F5E) | `rose-600` (#E11D48) | `rose-700` (#BE123C) |
| **Neutral** | `zinc` scale (100 $\rightarrow$ 900) | `slate` scale (100 $\rightarrow$ 900) | `zinc` scale (100 $\rightarrow$ 900) |

### 2.2 Typography
*   **Font Family**: 
    *   *Primary*: **Inter** (Sans-serif) - for readability across all platforms.
    *   *Accents (Customer App)*: **Poppins** (Geometric) - for headings to evoke a modern food-tech feel.
*   **Scale**:
    *   `h1`: 32px / Bold / Leading-tight (Page Titles)
    *   `h2`: 24px / SemiBold / Leading-snug (Section Headings)
    *   `h3`: 18px / Medium (Card Titles)
    *   `body`: 16px / Regular (Standard Text)
    *   `caption`: 12px / Regular / Muted (Metadata/Labels)

### 2.3 Spacing & Grid
*   **Base Unit**: $4\text{px}$ (All margins/padding must be multiples of $4$).
*   **Standard Layout**:
    *   **Mobile**: $\text{Screen Margin} = 16\text{px}$; $\text{Gutter} = 12\text{px}$.
    *   **Web**: $\text{Container Max-Width} = 1280\text{px}$; $\text{Sidebar Width} = 260\text{px}$.

### 2.4 Core Component Library (Atoms)
Reusable components to be implemented as base primitives:
*   **Button**: Primary (Filled), Secondary (Outline), Ghost (Text), Danger (Red).
*   **Input**: Text field, Select dropdown, Toggle/Switch, Number stepper.
*   **Card**: Elevated container with optional border and shadow.
*   **Modal**: Center-overlay for confirmation; Bottom-sheet for mobile options.
*   **Badge**: Status indicators (e.g., `Paid`, `Pending`, `Suspended`).
*   **Table (Web)**: Sortable, paginated data grid with row-actions.

---

## 3. User Flow Methodology

We will map journeys using a **Trigger $\rightarrow$ Action $\rightarrow$ System Response** flow.

**Example: Order Placement Flow**
1.  **Trigger**: User clicks "Checkout" in Cart.
2.  **Action**: `POST /api/v1/orders` is called.
3.  **UI State**: Screen transitions to `Loading` state (Skeleton or Spinner).
4.  **System Response**: 
    *   *Success*: Redirect to Stripe Payment $\rightarrow$ Redirect to Confirmation Screen.
    *   *Error*: Trigger `Error Toast` $\rightarrow$ Return User to Cart with highlighted error.

---

## 4. Screen Specification Template

Every individual screen will be documented using the following structure to ensure zero ambiguity for @ivan:

### [Screen Name]
*   **Goal**: (e.g., "Allow customer to customize food items and add to cart")
*   **Requirements Mapping**: (e.g., `UR-C01`, `UR-C02`)
*   **UI Elements**:
    *   `Element A`: Type (Button), Label ("Add to Cart"), Behavior (Primary).
    *   `Element B`: Type (Image), Source (`FoodItem.imageUrl`), Aspect Ratio (1:1).
*   **Interactions**:
    *   *On Click [Element A]* $\rightarrow$ Update Zustand Cart Store $\rightarrow$ Show "Added" Toast.
*   **API Dependencies**:
    *   `GET /api/v1/menu/{id}` $\rightarrow$ Populate Item Details.
    *   `POST /api/v1/cart/items` $\rightarrow$ Sync item to server.
*   **Edge Cases**:
    *   `Item Out of Stock`: Disable "Add to Cart" button, change label to "Unavailable".
    *   `Network Timeout`: Show Retry Modal.

---

## 5. Interaction Standards

To maintain consistency, the following global patterns are mandated:

### 5.1 Loading States
*   **Initial Load**: Use **Skeleton Screens** that match the layout of the final data to reduce perceived latency.
*   **Action Load**: Use **Inline Spinners** within buttons (e.g., "Processing..." within the button text).

### 5.2 Empty States
*   **Pattern**: Centered Illustration $\rightarrow$ Clear Heading $\rightarrow$ Call to Action (CTA) Button.
*   **Example**: "Your cart is empty" $\rightarrow$ [Browse Menu Button].

### 5.3 Feedback & Errors
*   **Toasts**: Small, non-blocking banners at the top/bottom of the screen.
    *   *Success*: Green checkmark + message.
    *   *Error*: Red warning + message.
*   **Field Validation**: Red border around input + caption text below the field for real-time validation errors.

### 5.4 Transition Logic
*   **Mobile**: Slide-in from right for hierarchical navigation (Home $\rightarrow$ Item Detail).
*   **Web**: Fade-in/out for page transitions to prevent jarring jumps.
