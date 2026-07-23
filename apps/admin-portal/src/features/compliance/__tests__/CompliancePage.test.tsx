import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CompliancePage } from '../pages/CompliancePage';
import { useAuthStore } from '../../../store/authStore';

let isPurgingState = false;

// Mock the useCompliance hook
vi.mock('../hooks/useCompliance', () => ({
  useCompliance: () => ({
    requests: [
      { id: 'REQ-001', email: 'john@email.com', tenant: 'Siam Authentic', type: 'ACCESS', status: 'PENDING' },
      { id: 'REQ-002', email: 'jane@email.com', tenant: 'Thai Garden', type: 'FORGOTTEN', status: 'PENDING' },
      { id: 'REQ-003', email: 'bob@email.com', tenant: 'Bangkok Bites', type: 'ACCESS', status: 'COMPLETED' },
    ],
    isLoading: false,
    purge: vi.fn((_arg: any, opts: any) => {
      isPurgingState = true;
      // Trigger re-render by updating state
      opts?.onSuccess?.();
    }),
    exportAudit: vi.fn(),
    isPurging: isPurgingState,
    isExporting: false,
    purgeProgress: 0,
  }),
}));

describe('CompliancePage', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    localStorage.removeItem('auth_token');
    useAuthStore.setState({
      user: 'founder@authentic.com',
      role: 'FOUNDER',
      token: 'test',
      isAuthenticated: true,
    });
    isPurgingState = false;
  });

  it('TC-COMP-013: should render compliance request table', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('Compliance Center')).toBeTruthy();
    });
  });

  it('should render Manage PDPA data subject requests subtitle', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('Manage PDPA data subject requests')).toBeTruthy();
    });
  });

  it('should render Execute Hard Purge button', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getAllByText('Execute Hard Purge').length).toBeGreaterThan(0);
    });
  });

  it('should render Export Audit Log button', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('Export Audit Log')).toBeTruthy();
    });
  });

  it('should render compliance request rows', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('REQ-001')).toBeTruthy();
    });
  });

  it('should render compliance request emails', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('john@email.com')).toBeTruthy();
    });
  });

  it('should render compliance request statuses', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getAllByText('pending').length).toBeGreaterThan(0);
    });
  });

  it('should render request count', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText(/pending requests/)).toBeTruthy();
    });
  });

  it('TC-COMP-014: should show purge confirmation modal when Execute Hard Purge clicked', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getAllByText('Execute Hard Purge').length).toBeGreaterThan(0);
    });
    const purgeButtons = screen.getAllByText('Execute Hard Purge');
    fireEvent.click(purgeButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('I Understand')).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('should render compliance table headers', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('Request ID')).toBeTruthy();
    });
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Tenant')).toBeTruthy();
    expect(screen.getByText('Type')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Actions')).toBeTruthy();
  });

  it('should render tenant names in requests', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('Siam Authentic')).toBeTruthy();
    });
  });

  it('should show "2 pending requests" count', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('2 pending requests')).toBeTruthy();
    });
  });
});