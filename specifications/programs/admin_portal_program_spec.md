# Program Specification: System Admin Web Portal
**Project**: authentic_th Food Ordering Ecosystem  
**Standard**: ISO/IEC/IEEE 1016:2009  
**Scope**: Frontend Program Logic for Admin Portal  
**Status**: Final Specification  
**Version**: 1.0

---

## 1. Architecture Overview

### 1.1 Tech Stack
- **Framework**: React 18.3 + TypeScript 5.5
- **Build**: Vite 5.4
- **Styling**: Tailwind CSS (zinc scale, Indigo primary)
- **Routing**: React Router v6
- **State**: Zustand (client) + TanStack Query (server state)
- **API**: Axios with interceptors
- **Charts**: Recharts

### 1.2 Directory Structure
```
src/
├── api/
│   ├── client.ts                 # Axios instance, interceptors
│   └── services/mockBackend.ts   # Mock data, service functions
├── components/
│   ├── ui/                       # Button, Input, Modal, Table, Badge, Card, Spinner, Toast
│   └── layout/                   # AdminSidebar, TopNav, PageShell
├── features/
│   ├── auth/
│   │   ├── guards/RequireAuth.tsx
│   │   └── components/LoginScreen.tsx
│   ├── tenant-mgmt/
│   │   ├── pages/TenantManagementPage.tsx
│   │   ├── hooks/useTenants.ts
│   │   └── components/
│   ├── billing-config/
│   │   ├── pages/BillingConfigPage.tsx
│   │   ├── hooks/useBilling.ts
│   │   └── components/
│   ├── global-reports/
│   │   ├── pages/DashboardPage.tsx
│   │   ├── hooks/useDashboard.ts
│   │   └── components/
│   ├── loyalty-settings/
│   │   ├── pages/LoyaltySettingsPage.tsx
│   │   ├── hooks/useLoyalty.ts
│   │   └── components/
│   └── compliance/
│       ├── pages/CompliancePage.tsx
│       ├── hooks/useCompliance.ts
│       └── components/
├── store/
│   ├── authStore.ts
│   └── uiStore.ts
├── types/
│   ├── tenant.ts
│   ├── billing.ts
│   ├── health.ts
│   ├── loyalty.ts
│   └── auth.ts
└── utils/
    ├── formatCurrency.ts
    └── formatRelativeTime.ts
```

### 1.3 Navigation Structure
```
BrowserRouter
├── /login → LoginScreen
└── / (RequireAuth guard)
    ├── / → DashboardPage
    ├── /tenants → TenantManagementPage
    ├── /billing → BillingConfigPage
    ├── /loyalty → LoyaltySettingsPage
    └── /compliance → CompliancePage
```

**Layout**: PageShell (AdminSidebar + TopNav + Outlet)

---

## 2. State Management

### 2.1 Auth Store
```typescript
type AdminRole = 'FOUNDER' | 'CO_FOUNDER' | null;

interface AuthState {
  user: string | null;
  role: AdminRole;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; role?: AdminRole };
  logout: () => void;
}
```

**Initialization**: Check localStorage for valid token on app load

### 2.2 UI Store
```typescript
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}
```

---

## 3. API Contracts

### 3.1 Auth Endpoints

**POST /api/v1/auth/login**
```typescript
// Request: { email, password }
// Response (200): { access_token, refresh_token, user: { id, email, role } }
```

### 3.2 Tenant Endpoints

**GET /api/v1/tenants**
```typescript
// Response (200): { data: Tenant[], meta: { total, page, per_page } }
```

**POST /api/v1/tenants**
```typescript
// Request: { name, domain }
// Response (201): Tenant
```

**POST /api/v1/tenants/{id}/suspend**
```typescript
// Response (200): { id, name, status: 'Suspended' }
```

**POST /api/v1/tenants/{id}/activate**
```typescript
// Response (200): { id, name, status: 'Active' }
```

**DELETE /api/v1/tenants/{id}**
```typescript
// Response (204): No content
```

### 3.3 Billing Endpoints

**GET /api/v1/governance/billing**
```typescript
// Response (200): { platformFee, adminFee, transactionFee }
```

**PUT /api/v1/governance/billing/global**
```typescript
// Request: Partial<FeeStructure>
// Response (200): { message, auditLog }
```

### 3.4 Loyalty Endpoints

**GET /api/v1/governance/loyalty**
```typescript
// Response (200): { conversionRate, allowOverride }
```

**PUT /api/v1/governance/loyalty/global**
```typescript
// Request: Partial<LoyaltySettings>
// Response (200): { message, redisInvalidated }
```

### 3.5 Health Endpoints

**GET /api/v1/governance/health/summary**
```typescript
// Response (200): { kpis: KPIMetrics, alerts: Alert[] }
```

**GET /api/v1/governance/metrics/global**
```typescript
// Response (200): { cpuUsage, memoryUsage, apiLatencyMs, dbConnections, timestamp }
```

### 3.6 Compliance Endpoints

**GET /api/v1/governance/compliance/requests**
```typescript
// Response (200): { data: ComplianceRequest[] }
```

**POST /api/v1/governance/compliance/purge**
```typescript
// Response (200): { completed: true, message }
```

**GET /api/v1/governance/compliance/export**
```typescript
// Response (200): CSV Blob
```

---

## 4. Hook Implementations

### 4.1 useTenants
```typescript
export function useTenants() {
  const { data: tenants, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantService.getAll,
  });
  
  const suspendMutation = useMutation({
    mutationFn: (id: string) => tenantService.suspend(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
  });
  
  // Similar for activate, delete, create...
  
  return {
    tenants, isLoading, error,
    suspend: suspendMutation.mutate,
    activate: activateMutation.mutate,
    delete: deleteMutation.mutate,
    create: createMutation.mutate,
  };
}
```

### 4.2 useBilling
```typescript
export function useBilling() {
  const { data: billing, isLoading, error } = useQuery({
    queryKey: ['billing'],
    queryFn: billingService.get,
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: Partial<FeeStructure>) => billingService.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['billing'] }),
  });
  
  return { billing, isLoading, error, update: updateMutation.mutate };
}
```

### 4.3 useDashboard
```typescript
export function useDashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: healthService.getKPIs,
  });
  
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: healthService.getAlerts,
  });
  
  const { data: latencyHistory, isLoading: latencyLoading } = useQuery({
    queryKey: ['latency-history'],
    queryFn: healthService.getLatencyHistory,
  });
  
  return {
    kpis, alerts, latencyHistory,
    isLoading: kpisLoading || alertsLoading || latencyLoading,
  };
}
```

### 4.4 useLoyalty
```typescript
export function useLoyalty() {
  const { data: loyalty, isLoading, error } = useQuery({
    queryKey: ['loyalty'],
    queryFn: loyaltyService.get,
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: Partial<LoyaltySettings>) => loyaltyService.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['loyalty'] }),
  });
  
  return { loyalty, isLoading, error, update: updateMutation.mutate };
}
```

### 4.5 useCompliance
```typescript
export function useCompliance() {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['compliance-requests'],
    queryFn: complianceService.getRequests,
  });
  
  const purgeMutation = useMutation({
    mutationFn: () => complianceService.getPurgeStatus(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['compliance-requests'] }),
  });
  
  return { requests, isLoading, error, purge: purgeMutation.mutate };
}
```

---

## 5. Screen Implementations

### 5.1 Login Screen
**File**: `src/features/auth/components/LoginScreen.tsx`

**Logic**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  if (!email || !validateEmail(email)) {
    setError('Please enter a valid email address');
    return;
  }
  if (!password || password.length < 8) {
    setError('Password must be at least 8 characters');
    return;
  }
  
  setLoading(true);
  await new Promise(r => setTimeout(r, 500));
  
  const result = login(email, password);
  if (result.success) {
    navigate('/', { replace: true });
  } else {
    setError('Invalid email or password');
  }
  setLoading(false);
};
```

---

### 5.2 Dashboard Page
**File**: `src/features/global-reports/pages/DashboardPage.tsx`

**Logic**:
```typescript
export function DashboardPage() {
  const { kpis, alerts, latencyHistory, isLoading } = useDashboard();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Monitor entire ecosystem health</p>
      </div>
      
      <GlobalKPIs kpis={kpis} loading={isLoading} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SystemHealthChart data={latencyHistory} loading={isLoading} />
        </div>
        <div>
          <TenantAlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
```

---

### 5.3 Tenant Management Page
**File**: `src/features/tenant-mgmt/pages/TenantManagementPage.tsx`

**Logic**:
```typescript
export function TenantManagementPage() {
  const { tenants, isLoading, suspend, activate, delete: deleteTenant, create } = useTenants();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  
  const handleSuspend = (id: string) => {
    if (confirm('Are you sure you want to suspend this tenant?')) {
      suspend(id);
      showToast('Tenant suspended', 'success');
    }
  };
  
  const handleDelete = (tenant: Tenant) => {
    if (tenant.status === 'Active') {
      if (!confirm('WARNING: Active tenant. Deleting will cancel all pending orders.')) {
        return;
      }
    }
    setDeleteTarget(tenant);
  };
  
  const handleCreate = (data: { name: string; domain: string }) => {
    if (!validateDomain(data.domain)) {
      showToast('Invalid domain format', 'error');
      return;
    }
    create(data);
    setShowAddModal(false);
    showToast('Tenant created', 'success');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-zinc-900">Tenant Management</h1>
          <p className="text-sm text-zinc-500">UR-A01: Control restaurant tenant lifecycle</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Add Tenant</Button>
      </div>
      
      <TenantDataTable 
        tenants={tenants || []}
        loading={isLoading}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
        onDelete={handleDelete}
      />
      
      {showAddModal && (
        <AddTenantModal onClose={() => setShowAddModal(false)} onSubmit={handleCreate} />
      )}
      
      {deleteTarget && (
        <Modal
          title={`Delete ${deleteTarget.name}`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => { deleteTenant(deleteTarget.id); setDeleteTarget(null); }}
          confirmLabel="Delete"
          variant="danger"
        >
          {deleteTarget.status === 'Active' ? (
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                This tenant is active. Deleting will cancel all pending orders.
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">All data will be permanently removed.</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
```

---

### 5.4 Billing Configuration Page
**File**: `src/features/billing-config/pages/BillingConfigPage.tsx`

**Logic**:
```typescript
export function BillingConfigPage() {
  const { billing, isLoading, update } = useBilling();
  const [form, setForm] = useState<Partial<FeeStructure>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (billing) setForm(billing);
  }, [billing]);
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (form.platformFee?.value !== undefined && form.platformFee.value < 0) {
      newErrors.platformFee = 'Fee cannot be negative';
    }
    if (form.platformFee?.type === 'PERCENTAGE' && form.platformFee.value !== undefined && form.platformFee.value > 100) {
      newErrors.platformFee = 'Percentage cannot exceed 100%';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleApply = async () => {
    if (!validate()) return;
    await update(form);
    showToast('Billing configuration updated', 'success');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[30px] font-bold text-zinc-900">Billing Configuration</h1>
        <p className="text-sm text-zinc-500">BMR-003: Define platform fee structure</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Fee Settings">
          <FeeValueInput label="Platform Fee" value={form.platformFee?.value} type={form.platformFee?.type} onChange={(v, t) => setForm(f => ({ ...f, platformFee: { value: v, type: t } }))} error={errors.platformFee} />
          <FeeValueInput label="Admin Fee" value={form.adminFee?.value} type={form.adminFee?.type} onChange={(v, t) => setForm(f => ({ ...f, adminFee: { value: v, type: t } }))} />
          <FeeValueInput label="Transaction Fee" value={form.transactionFee?.value} type={form.transactionFee?.type} onChange={(v, t) => setForm(f => ({ ...f, transactionFee: { value: v, type: t } }))} />
        </Card>
        
        <div className="space-y-6">
          <RevenuePreview platformFeePercent={form.platformFee?.type === 'PERCENTAGE' ? form.platformFee.value || 0 : 0} activeTenants={24} />
          <Card title="Fee Summary">
            <div className="space-y-2 text-sm">
              <p>Platform Fee: {form.platformFee?.type === 'PERCENTAGE' ? form.platformFee.value + '%' : '$' + form.platformFee?.value}</p>
              <p>Admin Fee: {form.adminFee?.type === 'PERCENTAGE' ? form.adminFee.value + '%' : '$' + form.adminFee?.value}</p>
              <p>Transaction Fee: {form.transactionFee?.type === 'PERCENTAGE' ? form.transactionFee.value + '%' : '$' + form.transactionFee?.value}</p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleApply} size="lg">Apply to All Tenants</Button>
      </div>
    </div>
  );
}
```

---

### 5.5 Loyalty Settings Page
**File**: `src/features/loyalty-settings/pages/LoyaltySettingsPage.tsx`

**Logic**:
```typescript
export function LoyaltySettingsPage() {
  const { loyalty, isLoading, update } = useLoyalty();
  const [rate, setRate] = useState(1.0);
  const [allowOverride, setAllowOverride] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (loyalty) {
      setRate(loyalty.conversionRate);
      setAllowOverride(loyalty.allowOverride);
    }
  }, [loyalty]);
  
  const handleRateChange = (value: number) => {
    setRate(value);
    if (value > 100) setError('Rate exceeds 100 points per dollar - may cause inflation issues');
    else if (value < 0) setError('Rate cannot be negative');
    else setError('');
  };
  
  const handleSave = async () => {
    if (error) return;
    await update({ conversionRate: rate, allowOverride });
    showToast('Settings saved successfully', 'success');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[30px] font-bold text-zinc-900">Loyalty Governance</h1>
        <p className="text-sm text-zinc-500">UR-A02: Set global loyalty point rules</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Conversion Rate">
          <ConversionRateInput value={rate} onChange={handleRateChange} error={error} />
        </Card>
        
        <Card title="Policy Summary">
          <PolicySummary conversionRate={rate} allowOverride={allowOverride} />
        </Card>
        
        <Card title="Override Settings">
          <OverrideToggle checked={allowOverride} onChange={setAllowOverride} label="Allow Override" helper="Restaurants can set custom rates" />
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">About This Policy</h3>
          <p className="text-sm text-zinc-600">The global loyalty policy defines how users earn and redeem points across all restaurant tenants.</p>
          <div className="mt-4 rounded-lg bg-amber-50 p-4">
            <p className="text-xs text-amber-800">[NOTE] Changes apply to all active tenants immediately. Historical point balances remain unaffected.</p>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!!error} size="lg">Save Global Policy</Button>
      </div>
    </div>
  );
}
```

---

### 5.6 Compliance Page
**File**: `src/features/compliance/pages/CompliancePage.tsx`

**Logic**:
```typescript
export function CompliancePage() {
  const { requests, isLoading, purge, export: exportLog, isPurging } = useCompliance();
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeStep, setPurgeStep] = useState(1);
  const [purgeConfirm, setPurgeConfirm] = useState('');
  
  const pendingCount = requests?.filter(r => r.status === 'PENDING').length || 0;
  
  const handlePurge = () => {
    setShowPurgeModal(true);
    setPurgeStep(1);
    setPurgeConfirm('');
  };
  
  const handlePurgeConfirm = async () => {
    if (purgeStep === 1) {
      setPurgeStep(2);
    } else if (purgeStep === 2 && purgeConfirm === 'PURGE') {
      await purge();
      setShowPurgeModal(false);
      showToast('Hard purge completed successfully', 'success');
    }
  };
  
  const handleExport = async () => {
    await exportLog();
    showToast('Audit log exported successfully', 'success');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-zinc-900">Compliance Center</h1>
          <p className="text-sm text-zinc-500">BOR-001: Manage PDPA data subject requests</p>
        </div>
        <Button onClick={handleExport} variant="secondary">Export Audit Log</Button>
      </div>
      
      {isPurging && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4">
          <Spinner size="sm" />
          <p className="text-sm text-blue-700">Processing purge request...</p>
        </div>
      )}
      
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-600">{pendingCount} pending requests</p>
          <Button onClick={handlePurge} disabled={pendingCount === 0 || isPurging} variant="danger">Execute Hard Purge</Button>
        </div>
        
        <RequestQueueTable requests={requests || []} loading={isLoading} />
      </Card>
      
      {showPurgeModal && (
        <Modal
          title={purgeStep === 1 ? 'Confirm Hard Purge' : 'Final Confirmation'}
          onClose={() => setShowPurgeModal(false)}
          onConfirm={handlePurgeConfirm}
          confirmLabel={purgeStep === 1 ? 'I Understand' : 'Confirm & Purge'}
          variant={purgeStep === 1 ? 'warning' : 'danger'}
        >
          {purgeStep === 1 ? (
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                Are you sure? This will permanently delete all user data for the {pendingCount} pending compliance requests.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-800">Final Confirmation Required. This will permanently delete ALL user data. This action is irreversible.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Type 'PURGE' to confirm</label>
                <input type="text" value={purgeConfirm} onChange={e => setPurgeConfirm(e.target.value)} className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2" placeholder="PURGE" />
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
```

---

## 6. Security Considerations

### 6.1 Authentication
- JWT tokens stored in localStorage
- Token validation on app load
- 401 responses redirect to login

### 6.2 RBAC
- FOUNDER: Full access
- CO_FOUNDER: Limited to certain reports

### 6.3 Audit Logging
- All configuration changes logged
- PDPA compliance for data purge

---

## 7. Error Handling

### 7.1 Network Errors
- Toast notifications for failed API calls
- Retry on failed mutations

### 7.2 Validation Errors
- Client-side validation before API call
- Inline field messages

### 7.3 Business Logic Errors
- Confirmation modals for destructive actions
- Warning messages for active tenant deletion

---

## 8. Testing Strategy

### 8.1 Unit Tests
- Store logic (authStore, uiStore)
- Utility functions (formatCurrency, formatRelativeTime)
- Hook logic (useTenants, useBilling, etc.)

### 8.2 Component Tests
- Render tests for all pages
- Interaction tests (button press, form submit)
- State transition tests (loading → success/error)

### 8.3 Integration Tests
- Auth flow (login → dashboard)
- Tenant CRUD (create, suspend, activate, delete)
- Billing config (update fees, apply globally)
- Compliance purge (multi-step confirmation)

### 8.4 E2E Tests (Future)
- Playwright for web testing

---

## 9. Traceability Matrix

| Requirement | Page | Hook | API Endpoint |
|------------|------|------|--------------|
| **UR-A01** (Tenant CRUD) | TenantManagementPage | useTenants | GET/POST/PUT/DELETE /tenants |
| **UR-A02** (Loyalty Rules) | LoyaltySettingsPage | useLoyalty | GET/PUT /governance/loyalty |
| **UR-A03** (System Health) | DashboardPage | useDashboard | GET /governance/health/summary |
| **BOR-001** (PDPA) | CompliancePage | useCompliance | GET/POST /governance/compliance |
| **BMR-003** (Revenue) | BillingConfigPage | useBilling | GET/PUT /governance/billing |

---

**This specification is binding for all Admin Portal implementation. No deviations without explicit approval from the project owner.**