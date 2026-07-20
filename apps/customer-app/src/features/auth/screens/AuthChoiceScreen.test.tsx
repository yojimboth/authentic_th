import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AuthChoiceScreen } from './AuthChoiceScreen';

// Mock navigation
const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockOnReturnToCheckout = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
    navigate: mockNavigate,
  }),
  useRoute: () => ({
    params: { onReturnToCheckout: mockOnReturnToCheckout },
  }),
  useIsFocused: () => true,
  useFocusEffect: jest.fn(),
}));

// Mock auth store
const mockSetGuest = jest.fn();
jest.mock('../../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    setGuest: mockSetGuest,
  }),
}));

// Mock white label config
jest.mock('../../../config/whiteLabelConfig', () => ({
  currentConfig: {
    restaurantName: 'Siam Authentic',
    slogan: 'Genuine Thai Flavour',
    logoSource: null,
    theme: {
      primaryColor: '#FF6B00',
      secondaryColor: '#F59E0B',
      backgroundColor: '#ffffff',
      borderColor: '#e4e4e7',
      activeTintColor: '#FF6B00',
      inactiveTintColor: '#71717a',
    },
  },
}));

describe('AuthChoiceScreen', () => {
  beforeEach(() => {
    mockSetGuest.mockClear();
    mockReplace.mockClear();
    mockNavigate.mockClear();
    mockOnReturnToCheckout.mockClear();
  });

  it('renders the restaurant name and slogan', () => {
    render(<AuthChoiceScreen />);

    expect(screen.getByText('Siam Authentic')).toBeTruthy();
    expect(screen.getByText('Genuine Thai Flavour')).toBeTruthy();
  });

  it('renders Continue as Guest button', () => {
    render(<AuthChoiceScreen />);
    expect(screen.getByText('Continue as Guest')).toBeTruthy();
  });

  it('renders Become a Member button', () => {
    render(<AuthChoiceScreen />);
    expect(screen.getByText('Become a Member')).toBeTruthy();
  });

  it('renders loyalty points benefit text', () => {
    render(<AuthChoiceScreen />);
    expect(
      screen.getByText('Member benefits: Earn loyalty points on every order')
    ).toBeTruthy();
  });

  it('calls setGuest and invokes onReturnToCheckout when guest is selected', () => {
    render(<AuthChoiceScreen />);
    fireEvent.press(screen.getByText('Continue as Guest'));

    expect(mockSetGuest).toHaveBeenCalled();
    expect(mockOnReturnToCheckout).toHaveBeenCalled();
  });

  it('navigates to Auth with onReturnToCheckout when Become a Member is selected', () => {
    render(<AuthChoiceScreen />);
    fireEvent.press(screen.getByText('Become a Member'));

    expect(mockNavigate).toHaveBeenCalledWith('Auth', expect.objectContaining({
      onReturnToCheckout: expect.any(Function),
    }));
  });
});