import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TenantManagementPage } from '../pages/TenantManagementPage';
import { useAuthStore } from '../../../store/authStore';

// Mock the useTenants hook
vi.mock('../hooks/useTenants', () => ({
  useTenants: () => ({
    tenants: [
      { id: '1', name: 'Siam Authentic', domain: 'siamauthentic.com', status: 'Active', createdAt: '2024-01-15' },
      { id: '2', name: 'Thai Garden', domain: 'thaigarden.com', status: 'Active', createdAt: '2024-02-20' },
      { id: '3', name: 'Bangkok Bites', domain: 'bangkokbites.com', status: 'Suspended', createdAt: '2024-03-10' },
      { id: '4', name: 'Chiang Mai Kitchen', domain: 'chiangmai.com', status: 'Active', createdAt: '2024-04-05' },
      { id: '5', name: 'Pattaya Pirates', domain: 'pattayapirates.com', status: 'Pending', createdAt: '2024-05-01' },
    ],
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
}));

describe('TenantManagementPage', () => {
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

  it('TC-COMP-006: should render tenant table', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
  });

  it('should render Tenant Management heading', () => {
    render(<TenantManagementPage />);
    expect(screen.getByText('Tenant Management')).toBeTruthy();
  });

  it('should render the UR-A01 description', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText(/Control restaurant tenant lifecycle/)).toBeTruthy();
    });
  });

  it('should show Add Tenant button', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Add Tenant')).toBeTruthy();
    });
  });

  it('TC-COMP-007: should show add tenant modal when button clicked', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Add Tenant')).toBeTruthy();
    });
    fireEvent.click(screen.getByText('Add Tenant'));
    await waitFor(() => {
      expect(screen.getByText('Add New Tenant')).toBeTruthy();
    });
  });

  it('should show tenant names in the table', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
    expect(screen.getByText('Thai Garden')).toBeTruthy();
  });

  it('should show tenant statuses', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    });
  });

  it('should render tenant domains in the table', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('siamauthentic.com')).toBeTruthy();
    });
  });

  it('should show "Manage restaurant tenant lifecycle" description', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Manage restaurant tenant lifecycle')).toBeTruthy();
    });
  });

  it('should render all initial tenants', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
    expect(screen.getByText('Thai Garden')).toBeTruthy();
    expect(screen.getByText('Bangkok Bites')).toBeTruthy();
    expect(screen.getByText('Chiang Mai Kitchen')).toBeTruthy();
  });

  it('should render tenant creation date', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
    expect(screen.getByText('2024-01-15')).toBeTruthy();
  });

  it('should show Suspended status for Bangkok Bites', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Suspended')).toBeTruthy();
    });
  });

  it('should show Pending status for Pattaya Pirates', async () => {
    render(<TenantManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeTruthy();
    });
  });
});