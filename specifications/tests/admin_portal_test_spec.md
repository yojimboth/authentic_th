# Test Specification: System Admin Web Portal
**Project**: authentic_th Food Ordering Ecosystem  
**Standard**: ISO/IEC/IEEE 29119:2013  
**Scope**: Test Cases for Admin Portal  
**Status**: Final Specification  
**Version**: 1.0

---

## 1. Test Strategy

### 1.1 Testing Levels
- **Unit Tests**: Components, hooks, stores, utilities
- **Integration Tests**: Feature flows (auth, tenant CRUD, billing, compliance)
- **E2E Tests** (Future): Full user journeys

### 1.2 Test Tools
- **Framework**: Vitest + React Testing Library
- **Mocking**: MSW (Mock Service Worker) for API
- **Coverage Target**: 80%+

### 1.3 Test Naming Convention
- Unit: `{feature}.test.ts` (e.g., `authStore.test.ts`)
- Component: `{PageName}.test.tsx` (e.g., `DashboardPage.test.tsx`)
- Integration: `{flow}-flow.test.tsx` (e.g., `tenant-crud-flow.test.tsx`)

---

## 2. Traceability Matrix

| Requirement | Test ID | Test Name | Level | Priority |
|------------|---------|-----------|-------|----------|
| **UR-A01** (Tenant CRUD) | TC-TENANT-001 | Tenant table loads | Unit | High |
| **UR-A01** (Tenant CRUD) | TC-TENANT-002 | Add tenant works | Integration | High |
| **UR-A01** (Tenant CRUD) | TC-TENANT-003 | Suspend tenant works | Integration | High |
| **UR-A01** (Tenant CRUD) | TC-TENANT-004 | Delete tenant works | Integration | High |
| **UR-A02** (Loyalty Rules) | TC-LOYALTY-001 | Load loyalty settings | Unit | Medium |
| **UR-A02** (Loyalty Rules) | TC-LOYALTY-002 | Update loyalty settings | Integration | High |
| **UR-A03** (System Health) | TC-HEALTH-001 | Load dashboard KPIs | Unit | Medium |
| **UR-A03** (System Health) | TC-HEALTH-002 | Load alerts | Unit | Medium |
| **BOR-001** (PDPA) | TC-COMPLIANCE-001 | Load compliance requests | Unit | Medium |
| **BOR-001** (PDPA) | TC-COMPLIANCE-002 | Execute hard purge | Integration | Critical |
| **BMR-003** (Revenue) | TC-BILLING-001 | Load billing config | Unit | Medium |
| **BMR-003** (Revenue) | TC-BILLING-002 | Update billing config | Integration | High |

---

## 3. Unit Test Specifications

### 3.1 Auth Store (`authStore.test.ts`)

**TC-AUTH-001: Initialize with no auth**
```typescript
it('should initialize with isAuthenticated: false', () => {
  const state = useAuthStore.getState();
  expect(state.isAuthenticated).toBe(false);
  expect(state.user).toBeNull();
  expect(state.role).toBeNull();
});
```

**TC-AUTH-002: Login with valid founder credentials**
```typescript
it('should login with valid founder credentials', () => {
  const result = useAuthStore.getState().login('founder@authentic.com', 'password123');
  expect(result.success).toBe(true);
  expect(result.role).toBe('FOUNDER');
  expect(useAuthStore.getState().isAuthenticated).toBe(true);
  expect(useAuthStore.getState().role).toBe('FOUNDER');
});
```

**TC-AUTH-003: Login with valid co-founder credentials**
```typescript
it('should login with valid co-founder credentials', () => {
  const result = useAuthStore.getState().login('cofounder@authentic.com', 'password123');
  expect(result.success).toBe(true);
  expect(result.role).toBe('CO_FOUNDER');
  expect(useAuthStore.getState().role).toBe('CO_FOUNDER');
});
```

**TC-AUTH-004: Login with invalid credentials**
```typescript
it('should fail login with invalid password', () => {
  const result = useAuthStore.getState().login('founder@authentic.com', 'wrong');
  expect(result.success).toBe(false);
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
});
```

**TC-AUTH-005: Logout**
```typescript
it('should logout and clear state', () => {
  useAuthStore.getState().login('founder@authentic.com', 'password123');
  useAuthStore.getState().logout();
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
  expect(useAuthStore.getState().user).toBeNull();
  expect(useAuthStore.getState().role).toBeNull();
});
```

**TC-AUTH-006: Restore session from localStorage**
```typescript
it('should restore session from localStorage on init', () => {
  // Mock localStorage
  const token = btoa(JSON.stringify({ sub: 'test-admin', role: 'FOUNDER', exp: Date.now() + 3600000 }));
  localStorage.setItem('auth_token', token);
  
  // Re-initialize store
  useAuthStore.getState();
  
  expect(useAuthStore.getState().isAuthenticated).toBe(true);
  expect(useAuthStore.getState().role).toBe('FOUNDER');
  
  // Cleanup
  localStorage.removeItem('auth_token');
});
```

---

### 3.2 UI Store (`uiStore.test.ts`)

**TC-UI-001: Toggle sidebar**
```typescript
it('should toggle sidebar', () => {
  const { toggleSidebar } = useUIStore.getState();
  toggleSidebar();
  expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  toggleSidebar();
  expect(useUIStore.getState().sidebarCollapsed).toBe(false);
});
```

**TC-UI-002: Show toast**
```typescript
it('should show toast', () => {
  const { showToast } = useUIStore.getState();
  showToast('Test message', 'success');
  expect(useUIStore.getState().toast).toEqual({
    message: 'Test message',
    type: 'success',
  });
});
```

**TC-UI-003: Hide toast**
```typescript
it('should hide toast', () => {
  const { showToast, hideToast } = useUIStore.getState();
  showToast('Test message', 'success');
  hideToast();
  expect(useUIStore.getState().toast).toBeNull();
});
```

---

### 3.3 Mock Backend (`mockBackend.test.ts`)

**TC-MOCK-001: Get tenants**
```typescript
it('should return mock tenants', async () => {
  const tenants = await tenantService.getAll();
  expect(tenants).toBeDefined();
  expect(tenants.length).toBeGreaterThan(0);
  expect(tenants[0]).toHaveProperty('id');
  expect(tenants[0]).toHaveProperty('name');
  expect(tenants[0]).toHaveProperty('domain');
  expect(tenants[0]).toHaveProperty('status');
});
```

**TC-MOCK-002: Create tenant**
```typescript
it('should create a new tenant', async () => {
  const newTenant = await tenantService.create({ name: 'Test Restaurant', domain: 'test.com' });
  expect(newTenant).toHaveProperty('id');
  expect(newTenant.name).toBe('Test Restaurant');
  expect(newTenant.domain).toBe('test.com');
  expect(newTenant.status).toBe('Pending');
});
```

**TC-MOCK-003: Suspend tenant**
```typescript
it('should suspend a tenant', async () => {
  const tenant = await tenantService.suspend('1');
  expect(tenant.status).toBe('Suspended');
});
```

**TC-MOCK-004: Activate tenant**
```typescript
it('should activate a tenant', async () => {
  const tenant = await tenantService.activate('1');
  expect(tenant.status).toBe('Active');
});
```

**TC-MOCK-005: Delete tenant**
```typescript
it('should delete a tenant', async () => {
  await expect(tenantService.delete('999')).rejects.toThrow('Tenant not found');
});
```

**TC-MOCK-006: Get billing config**
```typescript
it('should return mock billing config', async () => {
  const billing = await billingService.get();
  expect(billing).toHaveProperty('platformFee');
  expect(billing).toHaveProperty('adminFee');
  expect(billing).toHaveProperty('transactionFee');
});
```

**TC-MOCK-007: Update billing config**
```typescript
it('should update billing config', async () => {
  const updated = await billingService.update({ platformFee: { type: 'PERCENTAGE', value: 20 } });
  expect(updated.platformFee.value).toBe(20);
});
```

**TC-MOCK-008: Get loyalty settings**
```typescript
it('should return mock loyalty settings', async () => {
  const loyalty = await loyaltyService.get();
  expect(loyalty).toHaveProperty('conversionRate');
  expect(loyalty).toHaveProperty('allowOverride');
});
```

**TC-MOCK-009: Get dashboard KPIs**
```typescript
it('should return mock KPIs', async () => {
  const kpis = await healthService.getKPIs();
  expect(kpis).toHaveProperty('totalGMV');
  expect(kpis).toHaveProperty('activeTenants');
  expect(kpis).toHaveProperty('platformRevenue');
  expect(kpis).toHaveProperty('avgLatencyMs');
});
```

**TC-MOCK-010: Get alerts**
```typescript
it('should return mock alerts', async () => {
  const alerts = await healthService.getAlerts();
  expect(alerts).toBeDefined();
  expect(alerts.length).toBeGreaterThan(0);
  expect(alerts[0]).toHaveProperty('id');
  expect(alerts[0]).toHaveProperty('severity');
});
```

**TC-MOCK-011: Get compliance requests**
```typescript
it('should return mock compliance requests', async () => {
  const requests = await complianceService.getRequests();
  expect(requests).toBeDefined();
  expect(requests.length).toBeGreaterThan(0);
  expect(requests[0]).toHaveProperty('id');
  expect(requests[0]).toHaveProperty('email');
  expect(requests[0]).toHaveProperty('status');
});
```

**TC-MOCK-012: Execute purge**
```typescript
it('should execute purge', async () => {
  const result = await complianceService.getPurgeStatus();
  expect(result.completed).toBe(true);
  expect(result.message).toBe('Hard purge completed successfully');
});
```

---

### 3.4 Utilities (`utils/*.test.ts`)

**TC-UTIL-001: Format currency**
```typescript
it('should format currency correctly', () => {
  expect(formatCurrency(15.9)).toBe('$15.90');
  expect(formatCurrency(100)).toBe('$100.00');
  expect(formatCurrency(0)).toBe('$0.00');
  expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
});
```

**TC-UTIL-002: Format relative time**
```typescript
it('should format relative time correctly', () => {
  const now = Date.now();
  expect(formatRelativeTime(new Date(now - 1000).toISOString())).toBe('just now');
  expect(formatRelativeTime(new Date(now - 60000).toISOString())).toBe('1 minute ago');
  expect(formatRelativeTime(new Date(now - 3600000).toISOString())).toBe('1 hour ago');
  expect(formatRelativeTime(new Date(now - 86400000).toISOString())).toBe('1 day ago');
});
```

---

## 4. Component Test Specifications

### 4.1 LoginScreen (`LoginScreen.test.tsx`)

**TC-COMP-001: Render email and password fields**
```typescript
it('should render email and password inputs', () => {
  render(<LoginScreen />);
  expect(screen.getByLabelText('Email')).toBeTruthy();
  expect(screen.getByLabelText('Password')).toBeTruthy();
});
```

**TC-COMP-002: Show validation error for invalid email**
```typescript
it('should show email validation error', async () => {
  render(<LoginScreen />);
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByText('Sign In');
  
  fireEvent.change(emailInput, { target: { value: 'invalid' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton);
  
  await waitFor(() => {
    expect(screen.getByText(/Please enter a valid email/i)).toBeTruthy();
  });
});
```

**TC-COMP-003: Navigate to dashboard on success**
```typescript
it('should navigate to dashboard on successful login', async () => {
  const mockNavigate = vi.fn();
  vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
  }));
  
  render(<LoginScreen />);
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByText('Sign In');
  
  fireEvent.change(emailInput, { target: { value: 'founder@authentic.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton);
  
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
```

---

### 4.2 DashboardPage (`DashboardPage.test.tsx`)

**TC-COMP-004: Render dashboard with KPIs**
```typescript
it('should render dashboard with KPIs', async () => {
  render(<DashboardPage />);
  await waitFor(() => {
    expect(screen.getByText('Dashboard')).toBeTruthy();
  });
});
```

**TC-COMP-005: Show loading state**
```typescript
it('should show loading state while fetching data', () => {
  render(<DashboardPage />);
  expect(screen.getByTestId('loading-spinner')).toBeTruthy();
});
```

---

### 4.3 TenantManagementPage (`TenantManagementPage.test.tsx`)

**TC-COMP-006: Render tenant table**
```typescript
it('should render tenant table', async () => {
  render(<TenantManagementPage />);
  await waitFor(() => {
    expect(screen.getByText('Siam Authentic')).toBeTruthy();
  });
});
```

**TC-COMP-007: Show add tenant modal**
```typescript
it('should show add tenant modal when button clicked', async () => {
  render(<TenantManagementPage />);
  await waitFor(() => {
    expect(screen.getByText('+ Add Tenant')).toBeTruthy();
  });
  fireEvent.click(screen.getByText('+ Add Tenant'));
  expect(screen.getByText('Add New Tenant')).toBeTruthy();
});
```

**TC-COMP-008: Show delete confirmation for active tenant**
```typescript
it('should show warning for active tenant deletion', async () => {
  render(<TenantManagementPage />);
  // Click delete on active tenant
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  fireEvent.click(deleteButtons[0]);
  
  await waitFor(() => {
    expect(screen.getByText(/This tenant is active/i)).toBeTruthy();
  });
});
```

---

### 4.4 BillingConfigPage (`BillingConfigPage.test.tsx`)

**TC-COMP-009: Render billing configuration form**
```typescript
it('should render billing configuration form', async () => {
  render(<BillingConfigPage />);
  await waitFor(() => {
    expect(screen.getByText('Billing Configuration')).toBeTruthy();
  });
});
```

**TC-COMP-010: Validate negative fee**
```typescript
it('should show error for negative fee', async () => {
  render(<BillingConfigPage />);
  const feeInput = screen.getByLabelText('Platform Fee');
  fireEvent.change(feeInput, { target: { value: '-10' } });
  
  await waitFor(() => {
    expect(screen.getByText(/Fee cannot be negative/i)).toBeTruthy();
  });
});
```

---

### 4.5 LoyaltySettingsPage (`LoyaltySettingsPage.test.tsx`)

**TC-COMP-011: Render loyalty settings form**
```typescript
it('should render loyalty settings form', async () => {
  render(<LoyaltySettingsPage />);
  await waitFor(() => {
    expect(screen.getByText('Loyalty Governance')).toBeTruthy();
  });
});
```

**TC-COMP-012: Show warning for rate > 100**
```typescript
it('should show warning for rate exceeding 100', async () => {
  render(<LoyaltySettingsPage />);
  const rateInput = screen.getByLabelText(/Conversion Rate/i);
  fireEvent.change(rateInput, { target: { value: '150' } });
  
  await waitFor(() => {
    expect(screen.getByText(/Rate exceeds 100/i)).toBeTruthy();
  });
});
```

---

### 4.6 CompliancePage (`CompliancePage.test.tsx`)

**TC-COMP-013: Render compliance request table**
```typescript
it('should render compliance request table', async () => {
  render(<CompliancePage />);
  await waitFor(() => {
    expect(screen.getByText('Compliance Center')).toBeTruthy();
  });
});
```

**TC-COMP-014: Show purge confirmation modal**
```typescript
it('should show purge confirmation modal', async () => {
  render(<CompliancePage />);
  fireEvent.click(screen.getByText('Execute Hard Purge'));
  
  await waitFor(() => {
    expect(screen.getByText('Confirm Hard Purge')).toBeTruthy();
  });
});
```

---

## 5. Integration Test Specifications

### 5.1 Auth Flow (`auth-flow.test.tsx`)

**TC-FLOW-001: Complete login flow**
```typescript
it('should complete full login flow', async () => {
  render(<App />);
  
  // Should be on login page
  expect(screen.getByText('Admin Portal')).toBeTruthy();
  
  // Enter credentials
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'founder@authentic.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  
  // Click login
  fireEvent.click(screen.getByText('Sign In'));
  
  // Should navigate to dashboard
  await waitFor(() => {
    expect(screen.getByText('Dashboard')).toBeTruthy();
  });
});
```

### 5.2 Tenant CRUD Flow (`tenant-crud-flow.test.tsx`)

**TC-FLOW-002: Add, suspend, activate, delete tenant**
```typescript
it('should complete full tenant lifecycle', async () => {
  render(<TenantManagementPage />);
  
  // Add tenant
  fireEvent.click(screen.getByText('+ Add Tenant'));
  fireEvent.change(screen.getByLabelText('Restaurant Name'), { target: { value: 'New Restaurant' } });
  fireEvent.change(screen.getByLabelText('Domain'), { target: { value: 'newrestaurant.com' } });
  fireEvent.click(screen.getByText('Add Tenant'));
  
  await waitFor(() => {
    expect(screen.getByText('New Restaurant')).toBeTruthy();
  });
  
  // Suspend tenant
  const suspendButtons = screen.getAllByRole('button', { name: /suspend/i });
  fireEvent.click(suspendButtons[suspendButtons.length - 1]);
  
  await waitFor(() => {
    expect(screen.getByText('Suspended')).toBeTruthy();
  });
  
  // Activate tenant
  const activateButtons = screen.getAllByRole('button', { name: /activate/i });
  fireEvent.click(activateButtons[activateButtons.length - 1]);
  
  await waitFor(() => {
    expect(screen.getByText('Active')).toBeTruthy();
  });
  
  // Delete tenant
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  fireEvent.click(deleteButtons[deleteButtons.length - 1]);
  fireEvent.click(screen.getByText('Delete'));
  
  await waitFor(() => {
    expect(screen.queryByText('New Restaurant')).toBeNull();
  });
});
```

### 5.3 Billing Config Flow (`billing-flow.test.tsx`)

**TC-FLOW-003: Update billing configuration**
```typescript
it('should update billing configuration', async () => {
  render(<BillingConfigPage />);
  
  // Change platform fee
  const feeInput = screen.getByLabelText('Platform Fee');
  fireEvent.change(feeInput, { target: { value: '20' } });
  
  // Click apply
  fireEvent.click(screen.getByText('Apply to All Tenants'));
  
  await waitFor(() => {
    expect(screen.getByText(/Billing configuration updated/i)).toBeTruthy();
  });
});
```

### 5.4 Loyalty Config Flow (`loyalty-flow.test.tsx`)

**TC-FLOW-004: Update loyalty settings**
```typescript
it('should update loyalty settings', async () => {
  render(<LoyaltySettingsPage />);
  
  // Change conversion rate
  const rateInput = screen.getByLabelText(/Conversion Rate/i);
  fireEvent.change(rateInput, { target: { value: '1.5' } });
  
  // Toggle override
  fireEvent.click(screen.getByRole('switch'));
  
  // Click save
  fireEvent.click(screen.getByText('Save Global Policy'));
  
  await waitFor(() => {
    expect(screen.getByText(/Settings saved successfully/i)).toBeTruthy();
  });
});
```

### 5.5 Compliance Flow (`compliance-flow.test.tsx`)

**TC-FLOW-005: Execute hard purge**
```typescript
it('should complete multi-step purge flow', async () => {
  render(<CompliancePage />);
  
  // Click execute purge
  fireEvent.click(screen.getByText('Execute Hard Purge'));
  
  // Step 1: Click I Understand
  await waitFor(() => {
    expect(screen.getByText('I Understand')).toBeTruthy();
  });
  fireEvent.click(screen.getByText('I Understand'));
  
  // Step 2: Type PURGE
  const purgeInput = screen.getByPlaceholderText('PURGE');
  fireEvent.change(purgeInput, { target: { value: 'PURGE' } });
  
  // Click Confirm & Purge
  fireEvent.click(screen.getByText('Confirm & Purge'));
  
  await waitFor(() => {
    expect(screen.getByText(/Hard purge completed successfully/i)).toBeTruthy();
  });
});
```

---

## 6. Edge Case Test Specifications

### 6.1 Network Errors

**TC-EDGE-001: Handle API failure on tenant load**
```typescript
it('should show error on API failure', async () => {
  // Mock API failure
  vi.mocked(tenantService.getAll).mockRejectedValue(new Error('Network error'));
  
  render(<TenantManagementPage />);
  
  await waitFor(() => {
    expect(screen.getByText(/Failed to load/i)).toBeTruthy();
  });
});
```

### 6.2 Empty States

**TC-EDGE-002: Show empty state for tenants**
```typescript
it('should show empty state when no tenants', async () => {
  // Mock empty tenants
  vi.mocked(tenantService.getAll).mockResolvedValue([]);
  
  render(<TenantManagementPage />);
  
  await waitFor(() => {
    expect(screen.getByText(/No tenants found/i)).toBeTruthy();
  });
});
```

### 6.3 Form Validation

**TC-EDGE-003: Prevent form submission with invalid data**
```typescript
it('should prevent login with empty fields', async () => {
  render(<LoginScreen />);
  fireEvent.click(screen.getByText('Sign In'));
  
  // Should show validation errors
  await waitFor(() => {
    expect(screen.getByText(/Email is required/i)).toBeTruthy();
  });
});
```

### 6.4 Destructive Actions

**TC-EDGE-004: Cancel delete action**
```typescript
it('should cancel delete action', async () => {
  render(<TenantManagementPage />);
  
  // Click delete
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  fireEvent.click(deleteButtons[0]);
  
  // Click cancel
  fireEvent.click(screen.getByText('Cancel'));
  
  // Tenant should still be visible
  expect(screen.getByText('Siam Authentic')).toBeTruthy();
});
```

---

## 7. Performance Test Specifications

### 7.1 Render Performance

**TC-PERF-001: Dashboard render time**
```typescript
it('should render dashboard in under 300ms', () => {
  const start = performance.now();
  render(<DashboardPage />);
  const end = performance.now();
  expect(end - start).toBeLessThan(300);
});
```

### 7.2 API Response Time

**TC-PERF-002: API responses should complete in under 1s**
```typescript
it('should fetch tenants in under 1 second', async () => {
  const start = performance.now();
  await tenantService.getAll();
  const end = performance.now();
  expect(end - start).toBeLessThan(1000);
});
```

---

## 8. Test Data

### 8.1 Mock Admin Users
```typescript
const MOCK_USERS = [
  { email: 'founder@authentic.com', password: 'password123', role: 'FOUNDER' },
  { email: 'cofounder@authentic.com', password: 'password123', role: 'CO_FOUNDER' },
];
```

### 8.2 Mock Tenants
```typescript
const MOCK_TENANTS = [
  { id: '1', name: 'Siam Authentic', domain: 'siamauthentic.com', status: 'Active', createdAt: '2024-01-15' },
  { id: '2', name: 'Thai Garden', domain: 'thaigarden.com', status: 'Active', createdAt: '2024-02-20' },
  { id: '3', name: 'Bangkok Bites', domain: 'bangkokbites.com', status: 'Suspended', createdAt: '2024-03-10' },
];
```

### 8.3 Mock Billing Config
```typescript
const MOCK_BILLING = {
  platformFee: { type: 'PERCENTAGE', value: 15, currency: 'AUD' },
  adminFee: { type: 'FIXED', value: 50, currency: 'AUD' },
  transactionFee: { type: 'PERCENTAGE', value: 2.9, currency: 'AUD' },
};
```

### 8.4 Mock Loyalty Settings
```typescript
const MOCK_LOYALTY = {
  conversionRate: 1.0,
  allowOverride: false,
};
```

### 8.5 Mock Compliance Requests
```typescript
const MOCK_REQUESTS = [
  { id: 'REQ-001', email: 'john@email.com', tenant: 'Siam Authentic', type: 'ACCESS', status: 'PENDING' },
  { id: 'REQ-002', email: 'jane@email.com', tenant: 'Thai Garden', type: 'FORGOTTEN', status: 'PENDING' },
];
```

---

## 9. Test Execution

### 9.1 Run All Tests
```bash
npm test
```

### 9.2 Run Specific Test Suite
```bash
npm test -- authStore.test.ts
npm test -- DashboardPage.test.tsx
```

### 9.3 Run with Coverage
```bash
npm test -- --coverage
```

### 9.4 Watch Mode
```bash
npm test -- --watch
```

---

## 10. Test Maintenance

### 10.1 When to Update Tests
- New feature added
- Existing feature modified
- Bug fix that changes behavior
- UI/UX changes

### 10.2 Test Documentation
- Each test should have a clear description
- Mock setup should be documented
- Edge cases should be explicitly tested

### 10.3 Code Coverage Goals
- **Unit Tests**: 80%+
- **Component Tests**: 70%+
- **Integration Tests**: 60%+

---

**This specification is binding for all Admin Portal testing. Test cases must be created and maintained according to this document.**