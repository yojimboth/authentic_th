import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../store/orderStore', () => ({
  useOrderStore: () => ({
    orders: [],
    activeOrder: null,
    isLoading: false,
    setOrders: jest.fn(),
    setActiveOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    addOrder: jest.fn(),
    clearOrders: jest.fn(),
    setError: jest.fn(),
  }),
}));

describe('OrdersScreen', () => {
  it('renders the screen title', async () => {
    const { OrdersScreen } = require('../features/orders/screens/OrdersScreen');
    const mockNavigation = { navigate: jest.fn() };
    render(<OrdersScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(screen.getByText('My Orders')).toBeTruthy();
    });
  });

  it('renders filter tabs', async () => {
    const { OrdersScreen } = require('../features/orders/screens/OrdersScreen');
    const mockNavigation = { navigate: jest.fn() };
    render(<OrdersScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(screen.getByText('All')).toBeTruthy();
      expect(screen.getByText('Active')).toBeTruthy();
      expect(screen.getByText('Completed')).toBeTruthy();
    });
  });
});