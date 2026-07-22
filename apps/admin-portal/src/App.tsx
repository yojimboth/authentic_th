import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PageShell } from './components/layout/PageShell';
import { RequireAuth } from './features/auth/guards/RequireAuth';
import { LoginScreen } from './features/auth/components/LoginScreen';
import { DashboardPage } from './features/global-reports/pages/DashboardPage';
import { TenantManagementPage } from './features/tenant-mgmt/pages/TenantManagementPage';
import { BillingConfigPage } from './features/billing-config/pages/BillingConfigPage';
import { LoyaltySettingsPage } from './features/loyalty-settings/pages/LoyaltySettingsPage';
import { CompliancePage } from './features/compliance/pages/CompliancePage';
import { Toast } from './components/ui/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            element={
              <RequireAuth>
                <PageShell />
              </RequireAuth>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tenants" element={<TenantManagementPage />} />
            <Route path="/billing" element={<BillingConfigPage />} />
            <Route path="/loyalty" element={<LoyaltySettingsPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;