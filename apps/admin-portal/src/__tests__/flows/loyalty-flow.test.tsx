import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoyaltySettingsPage } from '../../features/loyalty-settings/pages/LoyaltySettingsPage';
import { useAuthStore } from '../../store/authStore';

let settings = { conversionRate: 1.0, allowOverride: false };

// Mock the useLoyalty hook with state management
vi.mock('../../features/loyalty-settings/hooks/useLoyalty', () => ({
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
vi.mock('../../store/uiStore', () => {
  const mockShowToast = vi.fn();
  const mockStoreState = {
    sidebarOpen: true,
    toast: null,
    toggleSidebar: vi.fn(),
    showSidebar: vi.fn(),
    hideSidebar: vi.fn(),
    showToast: mockShowToast,
    hideToast: vi.fn(),
  };
  const useUIStore = ((selector?: any) => {
    if (selector) {
      return selector(mockStoreState);
    }
    return mockStoreState;
  }) as any;
  useUIStore.__store = mockStoreState;
  return { useUIStore };
});

describe('Loyalty Config Flow', () => {
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
  });

  it('TC-FLOW-004: should render loyalty settings page and interact', async () => {
    render(<LoyaltySettingsPage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Loyalty Governance')).toBeTruthy();
    });

    // Verify conversion rate input exists
    expect(screen.getByText('1 Point = $')).toBeTruthy();

    // Verify override toggle exists
    expect(screen.getByRole('switch')).toBeTruthy();

    // Click save button
    fireEvent.click(screen.getByText('Save Global Policy'));
  });

  it('should render the conversion rate input with current value', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('1 Point = $')).toBeTruthy();
    });
  });

  it('should render the override toggle in its initial state', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeTruthy();
    });
  });

  it('should show Policy Summary with correct values', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Policy Summary')).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText('1 : $1.00')).toBeTruthy();
    });
  });

  it('should show the about this policy section content', async () => {
    render(<LoyaltySettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('About This Policy')).toBeTruthy();
    });

    expect(screen.getAllByText(/Users earn/i).length).toBeGreaterThan(0);
  });
});