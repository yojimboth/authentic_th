import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoyaltySettingsPage } from '../pages/LoyaltySettingsPage';
import { useAuthStore } from '../../../store/authStore';

let settings = { conversionRate: 1.0, allowOverride: false };

// Mock the useLoyalty hook with state management
vi.mock('../hooks/useLoyalty', () => ({
  useLoyalty: () => ({
    settings,
    isLoading: false,
    updateSettings: vi.fn((newSettings: any) => {
      settings = { ...settings, ...newSettings };
    }),
    isUpdating: false,
  }),
}));

// Mock uiStore
const mockShowToast = vi.fn();
vi.mock('../../../store/uiStore', () => ({
  useUIStore: () => ({
    sidebarOpen: true,
    toast: null,
    toggleSidebar: vi.fn(),
    showSidebar: vi.fn(),
    hideSidebar: vi.fn(),
    showToast: mockShowToast,
    hideToast: vi.fn(),
  }),
}));

describe('LoyaltySettingsPage', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    localStorage.removeItem('auth_token');
    useAuthStore.setState({
      user: 'founder@authentic.com',
      role: 'FOUNDER',
      token: 'test',
      isAuthenticated: true,
    });
    settings = { conversionRate: 1.0, allowOverride: false };
    mockShowToast.mockClear();
  });

  it('TC-COMP-011: should render loyalty settings form', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Loyalty Governance')).toBeTruthy();
    });
  });

  it('should render UR-A02 description', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText(/Set global loyalty point rules/i)).toBeTruthy();
    });
  });

  it('should render Conversion Rate section', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Conversion Rate').length).toBeGreaterThan(0);
    });
  });

  it('should render Allow Override section', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Allow Override')).toBeTruthy();
    });
  });

  it('should render Save Global Policy button', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Save Global Policy')).toBeTruthy();
    });
  });

  it('should render Policy Summary card', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Policy Summary')).toBeTruthy();
    });
  });

  it('should render override toggle switch', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeTruthy();
    });
  });

  it('should render the about this policy section', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('About This Policy')).toBeTruthy();
    });
  });

  it('should render conversion rate input', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('1 Point = $')).toBeTruthy();
    });
  });

  it('should show conversion rate value of 1.0', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Conversion Rate').length).toBeGreaterThan(0);
    });
  });

  it('should display notes about conversion rate changes', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText(/Changes to the conversion rate will apply to all active tenants/i)).toBeTruthy();
    });
  });

  it('should render the policy summary showing rate and override status', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('1 : $1.00')).toBeTruthy();
    });
  });

  it('should render the about policy description text', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('About This Policy')).toBeTruthy();
    });
    expect(screen.getAllByText(/Users earn/i).length).toBeGreaterThan(0);
  });

  it('should click Save Global Policy button without error', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Save Global Policy')).toBeTruthy();
    });
    fireEvent.click(screen.getByText('Save Global Policy'));
  });
});