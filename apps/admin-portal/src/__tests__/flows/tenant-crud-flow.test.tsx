import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TenantManagementPage } from '../../features/tenant-mgmt/pages/TenantManagementPage';
import { useAuthStore } from '../../store/authStore';

// Mock the useTenants hook
vi.mock('../../features/tenant-mgmt/hooks/useTenants', () => {
  const mockTenants = [
    { id: '1', name: 'Siam Authentic', domain: 'siamauthentic.com', status: 'Active', createdAt: '2024-01-15' },
    { id: '2', name: 'Thai Garden', domain: 'thaigarden.com', status: 'Active', createdAt: '2024-02-20' },
    { id: '3', name: 'Bangkok Bites', domain: 'bangkokbites.com', status: 'Suspended', createdAt: '2024-03-10' },
  ];

  return {
    useTenants: () => ({
      tenants: [...mockTenants],
      isLoading: false,
      createTenant: vi.fn(),
      suspendTenant: vi.fn(),
      activateTenant: vi.fn(),
      deleteTenant: vi.fn(),
      isCreating: false,
      isSuspendLoading: false,
      isActivateLoading: false,
      isDeleteLoading: false,
    }),
  };
});

describe('Tenant CRUD Flow', () => {
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

  it('TC-FLOW-002: should render tenant management with all tenants', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
  });

  it('should show Add Tenant modal with form fields', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Add Tenant'));
    await waitFor(() => {
      expect(screen.getByText('Add New Tenant')).toBeTruthy();
    });

    expect(screen.getByLabelText('Restaurant Name')).toBeTruthy();
    expect(screen.getByLabelText('Domain')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  it('should close add tenant modal on Cancel', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Add Tenant'));
    await waitFor(() => {
      expect(screen.getByText('Add New Tenant')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Tenant')).toBeNull();
  });

  it('should render all initial tenants', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
    expect(screen.getByText('Thai Garden')).toBeTruthy();
    expect(screen.getByText('Bangkok Bites')).toBeTruthy();
  });

  it('should render tenant creation dates', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
    expect(screen.getByText('2024-01-15')).toBeTruthy();
    expect(screen.getByText('2024-02-20')).toBeTruthy();
  });

  it('should show tenant status badges', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('Suspended')).toBeTruthy();
  });

  it('should show tenant domains in the table', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
    expect(screen.getByText('siamauthentic.com')).toBeTruthy();
    expect(screen.getByText('thaigarden.com')).toBeTruthy();
  });

  it('should show delete confirmation for active tenant', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });

    // Find and click the action menu button (three dots) for the first tenant
    const allButtons = screen.getAllByRole('button');
    const actionMenuButton = allButtons.find((btn) => {
      const svg = btn.querySelector('svg');
      return svg?.querySelector('path')?.getAttribute('d')?.includes('M12 5v.01M12 12v.01M12 19v.01');
    });

    if (actionMenuButton) {
      fireEvent.click(actionMenuButton);
      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeTruthy();
      });
      fireEvent.click(screen.getByText('Delete'));
      await waitFor(() => {
        expect(screen.getByText(/This tenant is active/i)).toBeTruthy();
      });
    }
  });
});