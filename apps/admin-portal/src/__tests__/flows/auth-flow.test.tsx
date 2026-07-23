import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../store/authStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const { LoginScreen } = await import('../../features/auth/components/LoginScreen');

const submitForm = (container: HTMLElement) => {
  const form = container.querySelector('form');
  if (form) {
    fireEvent.submit(form as HTMLFormElement);
  }
};

describe('Auth Flow', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    localStorage.removeItem('auth_token');
    mockNavigate.mockClear();
  });

  it('TC-FLOW-001: should complete full login flow', async () => {
    const { container } = render(<LoginScreen />);

    // Should be on login page
    expect(screen.getByText('Admin Portal')).toBeTruthy();

    // Enter credentials
    const emailInput = screen.getByPlaceholderText('admin@authentic.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'founder@authentic.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    submitForm(container);

    // Should navigate to dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should show login page when not authenticated', async () => {
    render(<LoginScreen />);
    expect(screen.getByText('Admin Portal')).toBeTruthy();
    expect(screen.getByText(/Platform Administrator/i)).toBeTruthy();
  });

  it('should show validation errors for empty form', async () => {
    const { container } = render(<LoginScreen />);
    submitForm(container);
    await waitFor(() => {
      expect(screen.getAllByText('Email is required').length).toBeGreaterThan(0);
    });
  });

  it('should show invalid credentials error on wrong login', async () => {
    const { container } = render(<LoginScreen />);
    const emailInput = screen.getByPlaceholderText('admin@authentic.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'founder@authentic.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass1' } });
    submitForm(container);

    await waitFor(() => {
      expect(screen.getAllByText('Invalid email or password').length).toBeGreaterThan(0);
    });
  });

  it('should log in with co-founder credentials', async () => {
    const { container } = render(<LoginScreen />);
    const emailInput = screen.getByPlaceholderText('admin@authentic.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'cofounder@authentic.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    submitForm(container);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should store token in localStorage on successful login', async () => {
    const { container } = render(<LoginScreen />);
    const emailInput = screen.getByPlaceholderText('admin@authentic.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'founder@authentic.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    submitForm(container);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
    expect(localStorage.getItem('auth_token')).toBeTruthy();
  });
});