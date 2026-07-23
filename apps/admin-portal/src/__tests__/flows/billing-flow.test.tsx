import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BillingConfigPage } from '../../features/billing-config/pages/BillingConfigPage';
import { useAuthStore } from '../../store/authStore';

// Mock the useBilling hook
vi.mock('../../features/billing-config/hooks/useBilling', () => ({
  useBilling: () => ({
    feeConfig: {
      platformFee: { type: 'PERCENTAGE' as const, value: 15, currency: 'AUD' },
      adminFee: { type: 'FIXED' as const, value: 50, currency: 'AUD' },
      transactionFee: { type: 'PERCENTAGE' as const, value: 2.9, currency: 'AUD' },
    },
    isLoading: false,
    updateFeeConfig: vi.fn(),
    isUpdating: false,
  }),
}));

describe('Billing Config Flow', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    localStorage.removeItem('auth_token');
    useAuthStore.setState({
      user: 'founder@authentic.com',
      role: 'FOUNDER',
      token: 'test',
      isAuthenticated: true,
    });
  });

  it('TC-FLOW-003: should render billing configuration page', async () => {
    render(<BillingConfigPage />);

    await waitFor(() => {
      expect(screen.getByText('Billing Configuration')).toBeTruthy();
    });

    expect(screen.getByText('Apply to All Tenants')).toBeTruthy();
  });

  it('should render default fee values', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Fee Settings')).toBeTruthy();
    });
  });

  it('should show revenue preview with active tenants count', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText(/24 active tenants/i)).toBeTruthy();
    });
  });

  it('should render fee summary with fee percentages', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('15%')).toBeTruthy();
    });
  });

  it('should render all fee type selectors', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Fee Settings')).toBeTruthy();
    });

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(3);
  });

  it('should render projected monthly revenue calculation', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Projected Monthly Revenue')).toBeTruthy();
    });
  });

  it('should render fee summary showing all fee types', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Fee Summary')).toBeTruthy();
    });
    expect(screen.getAllByText('Platform Fee').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Admin Fee').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Transaction Fee').length).toBeGreaterThan(0);
    expect(screen.getByText('Total per transaction')).toBeTruthy();
  });
});