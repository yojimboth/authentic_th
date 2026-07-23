import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardPage } from '../pages/DashboardPage';
import { useAuthStore } from '../../../store/authStore';

// Mock the useDashboard hook
vi.mock('../hooks/useDashboard', () => ({
  useDashboard: () => ({
    kpis: { totalGMV: 1200000, activeTenants: 4, platformRevenue: 45000, avgLatencyMs: 234 },
    alerts: [
      { id: 'a1', tenantName: 'Siam Authentic', message: 'Rate limit threshold at 85%', severity: 'warning', timestamp: new Date(Date.now() - 300000).toISOString() },
    ],
    latencyHistory: [
      { time: '10:00', latency: 150 },
      { time: '11:00', latency: 200 },
    ],
    isLoading: false,
  }),
}));

describe('DashboardPage', () => {
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

  it('TC-COMP-004: should render dashboard with KPIs', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeTruthy();
  });

  it('should render ecosystem health subtitle', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/Monitor entire ecosystem health/i)).toBeTruthy();
    });
  });

  it('should render after data loads', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });
  });

  it('should render system health chart section', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeTruthy();
    });
  });

  it('should render alerts section', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/Alerts \(\d+\)/i)).toBeTruthy();
    });
  });

  it('should display KPI cards with correct labels', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Total GMV')).toBeTruthy();
    });
    expect(screen.getByText('Active Tenants')).toBeTruthy();
    expect(screen.getByText('Platform Revenue')).toBeTruthy();
    expect(screen.getByText('System Latency')).toBeTruthy();
  });

  it('should render the 500ms threshold indicator', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('500ms threshold')).toBeTruthy();
    });
  });

  it('should render formatted currency for GMV', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('$1,200,000')).toBeTruthy();
    });
  });

  it('should render latency value', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('234ms')).toBeTruthy();
    });
  });
});