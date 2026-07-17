import { render, screen, waitFor } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: 'usr_1',
      tenantId: 'tenant_1',
      fullName: 'Test User',
      email: 'test@test.com',
      phone: '0412345678',
      role: 'owner' as const,
      primaryAddress: '123 Test St',
    },
    isAuthenticated: true,
    setUser: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe('ProfileScreen', () => {
  it('renders the screen title', async () => {
    const { ProfileScreen } = require('../features/profile/components/ProfileScreen');
    const mockNavigation = { navigate: jest.fn(), reset: jest.fn() };
    render(<ProfileScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeTruthy();
    });
  });

  it('renders user name and email', async () => {
    const { ProfileScreen } = require('../features/profile/components/ProfileScreen');
    const mockNavigation = { navigate: jest.fn(), reset: jest.fn() };
    render(<ProfileScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeTruthy();
      expect(screen.getByText('test@test.com')).toBeTruthy();
    });
  });
});