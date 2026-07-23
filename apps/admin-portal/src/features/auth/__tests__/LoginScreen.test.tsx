import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginScreen } from '../components/LoginScreen';
import { useAuthStore } from '../../../store/authStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    localStorage.removeItem('auth_token');
    mockNavigate.mockClear();
  });

  it('TC-COMP-001: should render email and password inputs', () => {
    render(<LoginScreen />);
    expect(screen.getByPlaceholderText('admin@authentic.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('should render the Admin Portal heading', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Admin Portal')).toBeTruthy();
  });

  it('should render the subtitle with Platform Administrator text', () => {
    render(<LoginScreen />);
    expect(screen.getByText(/Platform Administrator/i)).toBeTruthy();
  });

  it('should render the Sign In button', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('should render demo credentials', () => {
    render(<LoginScreen />);
    expect(screen.getByText('founder@authentic.com / password123')).toBeTruthy();
    expect(screen.getByText('cofounder@authentic.com / password123')).toBeTruthy();
  });

  it('should navigate to dashboard on successful login', async () => {
    render(<LoginScreen />);
    const emailInput = screen.getByPlaceholderText('admin@authentic.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'founder@authentic.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should show email validation placeholder', () => {
    render(<LoginScreen />);
    expect(screen.getByPlaceholderText('admin@authentic.com')).toBeTruthy();
  });

  it('should show password placeholder', () => {
    render(<LoginScreen />);
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('should render the platform admin subtitle', () => {
    render(<LoginScreen />);
    expect(screen.getByText(/Sign in to manage the platform/i)).toBeTruthy();
  });

  it('should render the login card', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Admin Portal')).toBeTruthy();
  });
});