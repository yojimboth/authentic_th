import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../store/menuStore', () => ({
  useMenuStore: () => ({
    categories: [],
    isLoading: false,
    setCategories: jest.fn(),
    toggleItemAvailability: jest.fn(),
    updateItem: jest.fn(),
    clearMenu: jest.fn(),
    setError: jest.fn(),
  }),
}));

describe('MenuScreen', () => {
  it('renders the screen title', async () => {
    const { MenuScreen } = require('../features/menu/screens/MenuScreen');
    const mockNavigation = { navigate: jest.fn() };
    render(<MenuScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(screen.getByText('Menu')).toBeTruthy();
    });
  });
});