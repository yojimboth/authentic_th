import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  ALWAYS_THIS_DEVICE_ONLY: 'ALWAYS_THIS_DEVICE_ONLY',
}));

jest.mock('../store/authStore', () => {
  const mockSetUser = jest.fn();
  const mockSetTokens = jest.fn();
  const mockLogout = jest.fn();
  return {
    useAuthStore: () => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      setUser: mockSetUser,
      setTokens: mockSetTokens,
      logout: mockLogout,
    }),
  };
});

const mockNavigation = {
  reset: jest.fn(),
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('LoginScreen', () => {
  it('renders email and password fields', async () => {
    const { LoginScreen } = require('../features/auth/components/LoginScreen');
    render(<LoginScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('your@email.com')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter password')).toBeTruthy();
    });
  });

  it('renders Sign In button', async () => {
    const { LoginScreen } = require('../features/auth/components/LoginScreen');
    render(<LoginScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email', async () => {
    const { LoginScreen } = require('../features/auth/components/LoginScreen');
    render(<LoginScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('Enter password');
      const signInButton = screen.getByText('Sign In');

      fireEvent.changeText(emailInput, 'invalid');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      expect(screen.getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('shows validation error for short password', async () => {
    const { LoginScreen } = require('../features/auth/components/LoginScreen');
    render(<LoginScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('Enter password');
      const signInButton = screen.getByText('Sign In');

      fireEvent.changeText(emailInput, 'test@test.com');
      fireEvent.changeText(passwordInput, 'short');
      fireEvent.press(signInButton);

      expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
    });
  });
});