import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BillingConfigPage } from '../pages/BillingConfigPage';
import { useAuthStore } from '../../../store/authStore';

// Mock the useBilling hook
vi.mock('../hooks/useBilling', () => ({
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

describe('BillingConfigPage', () => {
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

  it('TC-COMP-009: should render billing configuration form', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Billing Configuration')).toBeTruthy();
    });
  });

  it('should render UR-A02 description', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText(/Define platform fee structure/i)).toBeTruthy();
    });
  });

  it('should render Fee Settings card', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Fee Settings')).toBeTruthy();
    });
  });

  it('should render Platform Fee, Admin Fee, Transaction Fee labels', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Platform Fee').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('Admin Fee').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Transaction Fee').length).toBeGreaterThan(0);
  });

  it('should render Apply to All Tenants button', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Apply to All Tenants')).toBeTruthy();
    });
  });

  it('should render Revenue Preview card', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Revenue Preview')).toBeTruthy();
    });
  });

  it('should render Fee Summary card', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Fee Summary')).toBeTruthy();
    });
  });

  it('should render projected monthly revenue', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Projected Monthly Revenue')).toBeTruthy();
    });
  });

  it('should render billing config subtitle', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('UR-A02: Define platform fee structure')).toBeTruthy();
    });
  });

  it('should render fee type selectors', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Fee Settings')).toBeTruthy();
    });
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(3);
  });

  it('should render total per transaction summary', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText('Total per transaction')).toBeTruthy();
    });
  });

  it('should render active tenants count', async () => {
    render(<BillingConfigPage />);
    await waitFor(() => {
      expect(screen.getByText(/24 active tenants/i)).toBeTruthy();
    });
  });
});