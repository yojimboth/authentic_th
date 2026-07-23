# UX/UI Specification: System Admin Web Portal (Governance Portal)
**Project**: authentic_th Food Ordering Ecosystem  
**Design Persona**: "Governance & Clarity" | **Primary Color**: `brand-indigo` (#4F46E5)  
**Font**: Inter (All) | **Status**: Final Specification

---

## 1. Design System

### 1.1 Brand Mapping

| Element | Value | Usage |
|---------|-------|-------|
| **Primary** | `#4F46E5` (Indigo 600) | CTAs, active sidebar, links |
| **Secondary** | `#7C3AED` (Violet 600) | Accent, hover states |
| **Background** | `zinc-50` (#FAFAF9) | Page background |
| **Surface** | `white` (#FFFFFF) | Cards, modals |
| **Text Primary** | `zinc-900` (#18181B) | Headings, labels |
| **Text Secondary** | `zinc-500` (#71717A) | Body text, metadata |
| **Border** | `zinc-200` (#E4E4E7) | Card borders, dividers |
| **Success** | `emerald-500` (#10B981) | Active status, confirmations |
| **Warning** | `amber-500` (#F59E0B) | Pending status, alerts |
| **Danger** | `red-500` (#EF4444) | Suspended, delete actions |
| **Info** | `blue-500` (#3B82F6) | Informational badges |

### 1.2 Typography

| Level | Size / Weight | Family | Usage |
|-------|--------------|--------|-------|
| **h1** | 30px / 700 Bold | Inter | Main Page Titles |
| **h2** | 24px / 600 Semibold | Inter | Section Headings |
| **h3** | 18px / 500 Medium | Inter | Card Titles, Modal Headers |
| **body** | 16px / 400 Regular | Inter | Standard Paragraphs/Labels |
| **caption** | 12px / 400 Regular | Inter | Metadata, Helper Text, Dates |

### 1.3 Spacing Scale

Base unit: 4px. Common values: 4, 8, 12, 16, 24, 32, 48, 64

### 1.4 Component Library

#### Button
- **Layout**: `rounded-lg` (8px), `px-4 py-2` (Standard), `px-6 py-3` (Large)
- **Primary**: `bg-indigo-600 text-white`
- **Secondary**: `border-2 border-indigo-600 text-indigo-600 bg-transparent`
- **Ghost**: `text-zinc-600 hover:bg-zinc-100`
- **Danger**: `bg-red-500 text-white`
- **Loading**: Replace text with spinner, set `pointer-events-none`

#### Input Field
- **Layout**: `px-3 py-2 border rounded-md` (6px radius)
- **Default**: `border-zinc-300 bg-white text-zinc-900`
- **Focus**: `border-indigo-600 ring-2 ring-indigo-600/20`
- **Error**: `border-red-500 ring-red-500/20`
- **Disabled**: `bg-zinc-50 border-zinc-200 text-zinc-400`

#### Card
- **Layout**: `p-4 bg-white border border-zinc-200 rounded-xl shadow-sm`
- **Elevated**: `shadow-md border-transparent` (Featured items)
- **Flat**: `border-zinc-100 shadow-none` (List items)

#### Badge
- **Layout**: `px-2 py-0.5 rounded-full text-xs font-semibold`
- **Success**: `bg-emerald-100 text-emerald-700`
- **Warning**: `bg-amber-100 text-amber-700`
- **Danger**: `bg-red-100 text-red-700`
- **Info**: `bg-blue-100 text-blue-700`
- **Default**: `bg-zinc-100 text-zinc-700`

#### Modal
- **Layout**: Center overlay, `max-w-lg`, `rounded-2xl`, `shadow-2xl`
- **Backdrop**: `bg-black/50 backdrop-blur-sm`

#### DataTable
- **Layout**: `min-w-full divide-y divide-zinc-200`
- **Header**: `bg-zinc-50`
- **Row Hover**: `hover:bg-zinc-50`
- **Pagination**: Bottom bar with page numbers

---

## 2. Navigation Flow

```
Login → MainLayout (Sidebar + TopNav + Outlet)
                ↓
        Dashboard (/)
        Tenant Management (/tenants)
        Billing Configuration (/billing)
        Loyalty Settings (/loyalty)
        Compliance Center (/compliance)
```

**Sidebar Navigation**: 5 items (Dashboard, Tenant Mgmt, Billing, Loyalty, Compliance)

**Top Navigation**: Title "Platform Governance" (left), User badge + Sign Out (right)

---

## 3. Screen Specifications

### 3.1 Login Screen
**Purpose**: Authenticate platform administrator

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│            [Indigo Lightning Bolt]       │
│                                         │
│        Admin Portal                     │
│    Platform Administrator               │
│  Sign in to manage the platform         │
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
│  {error (red alert box)}                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Sign In                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─ Demo Credentials ─────────────┐   │
│  │ founder@authentic.com /         │   │
│  │   password123                   │   │
│  │ cofounder@authentic.com /       │   │
│  │   password123                   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Components**: `Input` (email, password), `Button` (primary, fullWidth), `Spinner`

**Validation**:
- Email: Valid email format
- Password: Minimum 8 characters

**States**:
- Loading: Button shows spinner
- Error: Red error message below button
- Success: Navigate to Dashboard

**Mock Credentials**:
- Founder: `founder@authentic.com` / `password123` (role: FOUNDER)
- Co-Founder: `cofounder@authentic.com` / `password123` (role: CO_FOUNDER)

---

### 3.2 Global Dashboard
**Purpose**: Monitoring the entire ecosystem health and financial performance

**Layout**:
```
┌─────────────────────────────────────────┐
│  Dashboard              [Refresh]       │
│                                         │
│  ┌─ KPIs ───────────────────────────┐  │
│  │  Total GMV    Active Tenants     │  │
│  │  $1.2M        24                 │  │
│  │  Platform Rev System Latency     │  │
│  │  $45K         234ms              │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ System Health ──────────────────┐  │
│  │  [Line Chart: API Latency vs Time]│  │
│  │  (red if >500ms)                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Alerts ─────────────────────────┐  │
│  │  • Tenant X exceeding rate limit │  │
│  │  • Tenant Y subscription expiring│  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Components**:
- `GlobalKPIs`: Grid → [Total GMV | Active Tenants | Platform Revenue | System Latency]
- `SystemHealthChart`: Line Chart → API Latency vs. Time (red if >500ms)
- `TenantAlertFeed`: List → "Tenant [X] is exceeding rate limits" → Action: "View Tenant"

**Interactions**:
- *Click Alert* → Navigate to `Tenant Management` → Filter by specific `tenant_id`

**API Dependencies**:
- `GET /api/v1/governance/health/summary` → Populate health metrics
- `GET /api/v1/governance/metrics/global` → Populate GMV and aggregate data

**Edge Cases**:
- *Critical System Failure*: Whole dashboard background shifts to `rose-50` with a "System Alert" banner at top

---

### 3.3 Tenant Management
**Purpose**: Control the lifecycle of restaurants on the platform

**Layout**:
```
┌─────────────────────────────────────────┐
│  Tenant Management        [+ Add Tenant]│
│                                         │
│  ┌─ Table ──────────────────────────┐  │
│  │ Name       | Domain    | Status  │  │
│  │ Siam Auth  | siam.io   | Active  │  │
│  │ Thai Garden| thai.garden|Active │  │
│  │            |           | Actions │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Pagination: [1] [2] [3] ... [20]      │
└─────────────────────────────────────────┘
```

**Components**:
- `TenantDataTable`: Table → Columns: [Restaurant Name | Domain | Status | Actions]
- `AddTenantButton`: Button → "Add New Tenant" → Primary
- `ActionMenu`: Dropdown → [Edit Config | Suspend | Activate | Delete]
- `StatusBadge`: Badge → "Active" (Green) / "Suspended" (Red) / "Pending" (Amber)

**Interactions**:
- *Click "Suspend"* → Confirmation Modal → `POST /api/v1/tenants/{id}/suspend` → Update badge to "Suspended" (Optimistic update)
- *Click "Add Tenant"* → Open registration modal → `POST /api/v1/tenants` → Navigate to Tenant Detail

**API Dependencies**:
- `GET /api/v1/tenants` → Populate table
- `POST /api/v1/tenants/{id}/suspend` → Execute suspension

**Edge Cases**:
- *Deleting Active Tenant*: Show "Heavy Warning" modal stating that all current orders will be cancelled

---

### 3.4 Billing Configuration
**Purpose**: Define the platform's fee structure and revenue model

**Layout**:
```
┌─────────────────────────────────────────┐
│  Billing Configuration                  │
│                                         │
│  ┌─ Fee Settings ───────────────────┐  │
│  │ Fee Type:    [Fixed Fee ▼]      │  │
│  │ Fee Value:   [$] ____________   │  │
│  │ Currency:    [AUD ▼]            │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌─ Revenue Preview ────────────────┐  │
│  │ Projected Monthly Revenue: $45,000│  │
│  │ Based on 24 active tenants        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [Apply to All Tenants] (Primary)       │
└─────────────────────────────────────────┘
```

**Components**:
- `FeeTypeSelector`: Dropdown → "Fixed Fee" / "Percentage Fee"
- `FeeValueInput`: Input → Numeric → Currency label (AUD)
- `RevenuePreview`: Card → "Projected Monthly Revenue: $[X]" → Updates in real-time
- `ApplyGlobalButton`: Button → "Apply to All Tenants" → Primary

**Interactions**:
- *Change Fee Value* → `POST /api/v1/governance/billing/validate` → Update `RevenuePreview`
- *Click Apply* → `PUT /api/v1/governance/billing/global` → Success Toast + Audit Log entry

**API Dependencies**:
- `GET /api/v1/governance/billing` → Load current fees
- `PUT /api/v1/governance/billing/global` → Update fee structure

**Edge Cases**:
- *Negative Fee*: Validation error → Shake animation on input field + red border

---

### 3.5 Loyalty Governance
**Purpose**: Set the global rules for the point system across all tenants

**Layout**:
```
┌─────────────────────────────────────────┐
│  Loyalty Governance                     │
│                                         │
│  ┌─ Conversion Rate ──────────────────┐ │
│  │ 1 Point = $[X] AUD                │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Override Settings ────────────────┐ │
│  │ [                    ] Allow        │ │
│  │ Restaurants to Override Rates       │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Policy Summary ───────────────────┐ │
│  │ Current Policy: Users earn 1 point │ │
│  │ per $1 spent. Stores can adjust.   │ │
│  └────────────────────────────────────┘ │
│                                         │
│  [Save Global Policy] (Primary)         │
└─────────────────────────────────────────┘
```

**Components**:
- `ConversionRateInput`: Input → "1 Point = $[X] AUD" → Numeric
- `OverrideToggle`: Switch → "Allow Restaurants to Override Rates" → Boolean
- `PolicySummary`: Box → "Current Policy: Users earn 1 point per $1 spent. Stores can either adjust." → Fixed text
- `SavePolicyButton`: Button → "Save Global Policy" → Primary

**Interactions**:
- *Click Save* → `PUT /api/v1/governance/loyalty/global` → Cache invalidation in Redis

**API Dependencies**:
- `GET /api/v1/governance/loyalty` → Load current rules
- `PUT /api/v1/governance/loyalty/global` → Update rules

**Edge Cases**:
- *Extreme Rate*: If rate is set to >100pt/$1, show "Warning: This rate may cause inflation in loyalty points."

---

### 3.6 Compliance Center
**Purpose**: Manage PDPA requests and ensure legal data hygiene

**Layout**:
```
┌─────────────────────────────────────────┐
│  Compliance Center    [Export Log]      │
│                                         │
│  ┌─ Request Queue ────────────────────┐ │
│  │ ID    | Email          | Type      │ │
│  │ REQ-01| john@email.com | Access    │ │
│  │ REQ-02| jane@email.com | Forgotten │ │
│  │       |                | Actions   │ │
│  └────────────────────────────────────┘ │
│                                         │
│  [Execute Hard Purge] (Danger)          │
└─────────────────────────────────────────┘
```

**Components**:
- `RequestQueueTable`: Table → Columns: [Request ID | User Email | Tenant | Request Type | Status]
- `RequestTypeBadge`: Badge → "Right to Access" (Blue) / "Right to be Forgotten" (Rose)
- `PurgeButton`: Button → "Execute Hard Purge" → Danger variant
- `AuditExportButton`: Button → "Export Compliance Log" → Secondary

**Interactions**:
- *Click "Execute Hard Purge"* → Multi-step confirmation ("I confirm this is a PDPA request") → `POST /api/v1/governance/compliance/purge` → Show progress bar
- *Export Log* → `GET /api/v1/governance/compliance/export` → Trigger CSV download

**API Dependencies**:
- `GET /api/v1/governance/compliance/requests` → Load queue
- `POST /api/v1/governance/compliance/purge` → Execute data deletion across all crates

**Edge Cases**:
- *User Not Found*: If purge is triggered for a non-existent user → Show "Error: User record not found in any tenant database."

---

## 4. User Flow Maps

### 4.1 Tenant Lifecycle Management Flow (UR-A01)

| Step | User Action | UI State Transition | System/API Interaction | Outcome |
|------|-------------|---------------------|----------------------|---------|
| 1 | Click "Add Tenant" | Modal opens | N/A | User can enter restaurant details |
| 2 | Enter name & domain | Form validation | N/A | Validate domain format |
| 3 | Click "Create" | Loading state | `POST /api/v1/tenants` | Tenant created with "Pending" status |
| 4 | View in table | Row appears | `GET /api/v1/tenants` | Optimistic update |
| 5 | Click "Suspend" | Confirmation modal | `POST /api/v1/tenants/{id}/suspend` | Status changes to "Suspended" |
| 6 | Click "Activate" | Confirmation modal | `POST /api/v1/tenants/{id}/activate` | Status changes to "Active" |
| 7 | Click "Delete" | Warning modal (if active) | `DELETE /api/v1/tenants/{id}` | Tenant removed |

---

### 4.2 Global Financial Configuration Flow (BMR-003)

| Step | User Action | UI State Transition | System/API Interaction | Outcome |
|------|-------------|---------------------|----------------------|---------|
| 1 | View current fees | Cards loaded | `GET /api/v1/governance/billing` | Display current configuration |
| 2 | Change fee type | Dropdown updates | N/A | Input field adapts (numeric vs percentage) |
| 3 | Enter fee value | Real-time validation | `POST /api/v1/governance/billing/validate` | Revenue preview updates |
| 4 | Review preview | Card shows projection | N/A | User confirms amounts |
| 5 | Click "Apply" | Loading state | `PUT /api/v1/governance/billing/global` | Fees applied globally |
| 6 | Success feedback | Toast notification | Audit log entry | Configuration persisted |

---

### 4.3 Global Loyalty Governance Flow (UR-A02)

| Step | User Action | UI State Transition | System/API Interaction | Outcome |
|------|-------------|---------------------|----------------------|---------|
| 1 | View current rate | Card loaded | `GET /api/v1/governance/loyalty` | Display current policy |
| 2 | Adjust conversion rate | Input updates | N/A | Real-time validation |
| 3 | Toggle override permission | Switch updates | N/A | Policy summary updates |
| 4 | Review policy summary | Card reflects changes | N/A | User confirms settings |
| 5 | Click "Save" | Loading state | `PUT /api/v1/governance/loyalty/global` | Global policy updated |
| 6 | Redis cache invalidation | Toast notification | N/A | All tenants receive new rules |

---

### 4.4 System Health & Monitoring Flow (UR-A03)

| Step | User Action | UI State Transition | System/API Interaction | Outcome |
|------|-------------|---------------------|----------------------|---------|
| 1 | View dashboard | KPIs loaded | `GET /api/v1/governance/health/summary` | Real-time metrics displayed |
| 2 | Review health chart | Line chart renders | `GET /api/v1/governance/metrics/global` | 24h latency trend visible |
| 3 | Identify anomalies | Red threshold line at 500ms | N/A | High latency periods highlighted |
| 4 | Click alert | Navigate to tenant detail | `GET /api/v1/tenants/{id}` | Tenant-specific data shown |
| 5 | Take action | Suspend/activate tenant | `POST /api/v1/tenants/{id}/suspend` | System health improves |

---

### 4.5 Compliance & PDPA Management Flow (BOR-001)

| Step | User Action | UI State Transition | System/API Interaction | Outcome |
|------|-------------|---------------------|----------------------|---------|
| 1 | Review request queue | Table loaded | `GET /api/v1/governance/compliance/requests` | All PDPA requests displayed |
| 2 | Identify pending requests | Badges show status | N/A | User prioritizes urgent cases |
| 3 | Click "Execute Hard Purge" | Multi-step modal opens | N/A | User confirms destructive action |
| 4 | Step 1: Acknowledge | Warning modal shown | N/A | User reads consequences |
| 5 | Step 2: Type "PURGE" | Final confirmation | N/A | User must explicitly confirm |
| 6 | Click "Confirm & Purge" | Progress bar shown | `POST /api/v1/governance/compliance/purge` | Data deletion initiated |
| 7 | Completion | Success toast | N/A | Audit log updated |
| 8 | Export audit log | CSV download | `GET /api/v1/governance/compliance/export` | Compliance record saved |

---

## 5. Component Architecture (Composition View)

### 5.1 Admin Dashboard (System Health & KPIs)
The dashboard serves as the entry point for the Founder/Co-founder.
- **KPI Tiles**: Real-time counters for Total Active Tenants, Total Orders (24h), Total GMV, and System Error Rate.
- **System Health Monitor**: A visual indicator of API latency and database health (connecting to `UR-A03`).
- **Active Alerts**: A notification feed for tenant subscription expirations or critical system failures.

### 5.2 Management Tables (Complex Data Grids)
Used extensively in `tenant-mgmt` and `compliance`.
- **Implementation**: A generic `DataTable<T>` wrapper.
- **Capabilities**:
  - **Server-side Pagination**: Utilizing the `meta` object defined in the Overall SDD.
  - **Multi-column Filtering**: Filter by tenant status, domain, or creation date.
  - **Action Menu**: Contextual actions (e.g., "Suspend Tenant", "Edit Config") per row.

### 5.3 Configuration Forms
Used in `billing-config` and `loyalty-settings`.
- **Dynamic Input Fields**: Support for toggling between "Fixed Fee" (Numeric input) and "Percentage Fee" (Percentage slider/input).
- **Validation**: Zod-based schema validation for all admin inputs to ensure data integrity.
- **Audit Logging**: Every change triggers a confirmation modal indicating that the action is logged for PDPA compliance.

### 5.4 Styling Strategy
- **Framework**: Tailwind CSS
- **Design Tokens**:
  - **Colors**: Neutral-heavy palette (Slate/Zinc) with high-contrast primary accents (Indigo/Violet) for "Admin" branding.
  - **Responsiveness**: Sidebar-collapsible layout for tablet and desktop views.

---

## 6. Role-Based Access Control

### 6.1 Admin Roles

```typescript
export enum AdminRole {
  FOUNDER = 'FOUNDER',
  CO_FOUNDER = 'CO_FOUNDER'
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  permissions: string[]; // e.g., ['manage_tenants', 'edit_fees', 'view_reports']
}
```

### 6.2 Permission Matrix

| Feature | FOUNDER | CO_FOUNDER |
|---------|---------|------------|
| View Dashboard | ✅ | ✅ |
| Manage Tenants | ✅ | ✅ |
| Edit Billing Config | ✅ | ✅ |
| Edit Loyalty Settings | ✅ | ✅ |
| View Total Platform Revenue | ✅ | ❌ |
| View Founder & Co-Founder Taking Report | ✅ | ✅ |
| Execute Hard Purge | ✅ | ✅ |
| Export Audit Logs | ✅ | ✅ |

---

## 7. API Contract Reference

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/v1/auth/login` | POST | Admin authentication | Public |
| `/api/v1/tenants` | GET | List all tenants | Founder/Co-Founder |
| `/api/v1/tenants` | POST | Create new tenant | Founder |
| `/api/v1/tenants/{id}/suspend` | POST | Suspend tenant | Founder |
| `/api/v1/tenants/{id}/activate` | POST | Activate tenant | Founder |
| `/api/v1/tenants/{id}` | DELETE | Delete tenant | Founder |
| `/api/v1/governance/billing` | GET | Get fee configuration | Founder/Co-Founder |
| `/api/v1/governance/billing` | PUT | Update fee configuration | Founder |
| `/api/v1/governance/loyalty` | GET | Get loyalty settings | Founder/Co-Founder |
| `/api/v1/governance/loyalty` | PUT | Update loyalty settings | Founder |
| `/api/v1/governance/health/summary` | GET | Get system health summary | Founder/Co-Founder |
| `/api/v1/governance/metrics/global` | GET | Get global metrics | Founder/Co-Founder |
| `/api/v1/governance/compliance/requests` | GET | Get PDPA requests | Founder/Co-Founder |
| `/api/v1/governance/compliance/purge` | POST | Execute hard purge | Founder |
| `/api/v1/governance/compliance/export` | GET | Export audit log | Founder/Co-Founder |

---

## 8. Traceability Matrix

| Requirement | Screen | Component |
|------------|--------|-----------|
| **UR-A01** (Tenant CRUD) | Tenant Management | TenantDataTable, ActionMenu, AddTenantModal |
| **UR-A02** (Loyalty Rules) | Loyalty Settings | ConversionRateInput, OverrideToggle, PolicySummary |
| **UR-A03** (System Health) | Global Dashboard | GlobalKPIs, SystemHealthChart, TenantAlertFeed |
| **BOR-001** (PDPA Compliance) | Compliance Center | RequestQueueTable, PurgeButton, AuditExportButton |
| **BMR-002** (Global Config) | Billing Configuration | FeeTypeSelector, FeeValueInput, RevenuePreview |
| **BMR-003** (Revenue Collection) | Billing Configuration | FeeValueInput, ApplyGlobalButton |
| **BMR-005** (Aggregated Reporting) | Global Dashboard | GlobalKPIs, SystemHealthChart |
| **BOR-004** (Access Control) | Login, RequireAuth | RBAC guards, AdminRole enum |

---

## 9. Accessibility

### 9.1 Screen Reader Support
- All interactive elements have accessible labels
- Proper ARIA roles for modals, buttons, and form fields
- Focus management for modal open/close

### 9.2 Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text and UI components
- Indigo/white combinations tested for WCAG AA compliance

### 9.3 Keyboard Navigation
- Full keyboard navigation support
- Tab order follows visual layout
- Modal dismissal with Escape key

---

## 10. Responsive Design

### 10.1 Breakpoints
- **Desktop**: 1024px+ (Primary target)
- **Tablet**: 768px - 1023px (Sidebar collapsible)
- **Mobile**: < 768px (Not officially supported, but functional)

### 10.2 Layout Adaptation
- Fixed left sidebar (240px) on desktop
- Collapsible sidebar on tablet (hamburger menu)
- Stacked layout on mobile (if accessed)

---

## 11. Error Handling

### 11.1 Network Errors
- Toast notifications for failed API calls
- Retry button on failed operations
- Offline detection with banner

### 11.2 API Errors
- Validation errors: Inline field messages
- Server errors: Toast with generic message
- Authentication errors: Redirect to login

### 11.3 Validation Errors
- Client-side validation before API call
- Clear error messages with recovery guidance
- Form submission validation (show all errors at once)

---

## 12. Future Enhancements

### 12.1 Real-time Updates
- WebSocket connections for live tenant status changes
- Real-time alert notifications
- Live system health metrics

### 12.2 Advanced Reporting
- Custom report builder
- Export to PDF/Excel
- Scheduled report generation

### 12.3 Multi-language
- English (primary)
- Thai (secondary)
- Mandarin (future)

### 12.4 Advanced RBAC
- Custom role creation
- Granular permission controls
- Permission audit trails

---

**This specification is binding for all Admin Portal implementation. No deviations without explicit approval from the project owner.**