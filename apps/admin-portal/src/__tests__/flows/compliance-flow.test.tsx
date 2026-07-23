import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CompliancePage } from '../../features/compliance/pages/CompliancePage';
import { useAuthStore } from '../../store/authStore';

let isPurgingState = false;

// Mock the useCompliance hook
vi.mock('../../features/compliance/hooks/useCompliance', () => ({
  useCompliance: () => ({
    requests: [
      { id: 'REQ-001', email: 'john@email.com', tenant: 'Siam Authentic', type: 'ACCESS', status: 'PENDING' },
      { id: 'REQ-002', email: 'jane@email.com', tenant: 'Thai Garden', type: 'FORGOTTEN', status: 'PENDING' },
      { id: 'REQ-003', email: 'bob@email.com', tenant: 'Bangkok Bites', type: 'ACCESS', status: 'COMPLETED' },
    ],
    isLoading: false,
    purge: vi.fn((_arg: any, opts: any) => {
      isPurgingState = true;
      opts?.onSuccess?.();
    }),
    exportAudit: vi.fn(),
    isPurging: isPurgingState,
    isExporting: false,
    purgeProgress: 0,
  }),
}));

describe('Compliance Flow', () => {
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

  it('TC-FLOW-005: should render compliance page and open purge modal', async () => {
    render(<CompliancePage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Compliance Center')).toBeTruthy();
    });

    // Click execute purge
    const purgeButtons = screen.getAllByText('Execute Hard Purge');
    fireEvent.click(purgeButtons[0]);

    // Step 1: Should show I Understand button
    await waitFor(() => {
      expect(screen.getByText('I Understand')).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('should navigate between purge confirmation steps', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getAllByText('Execute Hard Purge').length).toBeGreaterThan(0);
    });

    const purgeButtons = screen.getAllByText('Execute Hard Purge');
    fireEvent.click(purgeButtons[0]);

    // Step 1 - Initial confirmation
    await waitFor(() => {
      expect(screen.getByText('I Understand')).toBeTruthy();
    }, { timeout: 5000 });

    // Should have Cancel and I Understand buttons
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('I Understand')).toBeTruthy();

    // Click I Understand
    fireEvent.click(screen.getByText('I Understand'));

    // Step 2 - Final confirmation
    await waitFor(() => {
      expect(screen.getByText('Confirm & Purge')).toBeTruthy();
    }, { timeout: 5000 });

    // Should have Cancel and Confirm & Purge buttons
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Confirm & Purge')).toBeTruthy();
  });

  it('should cancel purge confirmation', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getAllByText('Execute Hard Purge').length).toBeGreaterThan(0);
    });

    const purgeButtons = screen.getAllByText('Execute Hard Purge');
    fireEvent.click(purgeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('I Understand')).toBeTruthy();
    }, { timeout: 5000 });

    fireEvent.click(screen.getByText('Cancel'));

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText('I Understand')).toBeNull();
    }, { timeout: 5000 });
  });

  it('should render compliance request table with all columns', async () => {
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

  it('should show pending request count', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('2 pending requests')).toBeTruthy();
    });
  });

  it('should render all compliance request rows', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('REQ-001')).toBeTruthy();
    });
    expect(screen.getByText('REQ-002')).toBeTruthy();
  });

  it('should show audit log export button', async () => {
    render(<CompliancePage />);
    await waitFor(() => {
      expect(screen.getByText('Export Audit Log')).toBeTruthy();
    });
  });
});