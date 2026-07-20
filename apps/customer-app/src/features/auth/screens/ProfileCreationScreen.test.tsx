import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ProfileCreationScreen } from './ProfileCreationScreen';

// Mock navigation
const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockOnReturnToCheckout = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: { email: 'test@example.com', onReturnToCheckout: mockOnReturnToCheckout },
  }),
  useIsFocused: () => true,
  useFocusEffect: jest.fn(),
}));

// Mock auth store
const mockCompleteProfile = jest.fn();
jest.mock('../../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    completeProfile: mockCompleteProfile,
  }),
}));

describe('ProfileCreationScreen', () => {
  beforeEach(() => {
    mockCompleteProfile.mockReset();
    mockReplace.mockClear();
    mockGoBack.mockClear();
    mockOnReturnToCheckout.mockClear();
  });

  it('renders the welcome message and form fields', () => {
    render(<ProfileCreationScreen />);

    expect(screen.getByText('Welcome!')).toBeTruthy();
    expect(
      screen.getByText('Set up your profile to start earning points')
    ).toBeTruthy();
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('Phone Number')).toBeTruthy();
  });

  it('renders input fields with correct placeholders', () => {
    render(<ProfileCreationScreen />);

    expect(screen.getByPlaceholderText('Liam Wilson')).toBeTruthy();
    expect(screen.getByPlaceholderText('0412 345 678')).toBeTruthy();
  });

  it('renders the continue button', () => {
    render(<ProfileCreationScreen />);
    expect(screen.getByText('Continue')).toBeTruthy();
  });

  it('shows phone format helper text', () => {
    render(<ProfileCreationScreen />);
    expect(screen.getByText('Format: 04XX XXX XXX')).toBeTruthy();
  });

  it('shows validation error for short name (with valid phone)', async () => {
    mockCompleteProfile.mockResolvedValue({} as any);

    render(<ProfileCreationScreen />);

    const nameInput = screen.getByPlaceholderText('Liam Wilson');
    fireEvent.changeText(nameInput, 'A');

    // Need a valid phone too so the name validation triggers first
    const phoneInput = screen.getByPlaceholderText('0412 345 678');
    fireEvent.changeText(phoneInput, '0412345678');

    const continueButton = screen.getByText('Continue');
    await act(async () => {
      fireEvent.press(continueButton);
    });

    expect(
      screen.getByText('Name must be 2-60 characters')
    ).toBeTruthy();
  });

  it('shows validation error for invalid Australian phone', async () => {
    mockCompleteProfile.mockResolvedValue({} as any);

    render(<ProfileCreationScreen />);

    const nameInput = screen.getByPlaceholderText('Liam Wilson');
    fireEvent.changeText(nameInput, 'John Doe');

    const phoneInput = screen.getByPlaceholderText('0412 345 678');
    fireEvent.changeText(phoneInput, '12345');

    const continueButton = screen.getByText('Continue');
    await act(async () => {
      fireEvent.press(continueButton);
    });

    expect(
      screen.getByText(
        'Please enter a valid Australian phone number (04XX XXX XXX)'
      )
    ).toBeTruthy();
  });

  it('formats phone number as user types', () => {
    render(<ProfileCreationScreen />);

    const phoneInput = screen.getByPlaceholderText('0412 345 678');

    fireEvent.changeText(phoneInput, '0412345678');

    // Should auto-format to "0412 345 678"
    expect(phoneInput.props.value).toBe('0412 345 678');
  });

  it('returns to checkout on successful profile creation', async () => {
    mockCompleteProfile.mockResolvedValue({} as any);

    render(<ProfileCreationScreen />);

    const nameInput = screen.getByPlaceholderText('Liam Wilson');
    fireEvent.changeText(nameInput, 'John Doe');

    const phoneInput = screen.getByPlaceholderText('0412 345 678');
    fireEvent.changeText(phoneInput, '0412345678');

    const continueButton = screen.getByText('Continue');
    await act(async () => {
      fireEvent.press(continueButton);
    });

    expect(mockCompleteProfile).toHaveBeenCalledWith({
      name: 'John Doe',
      phone: '0412345678',
      email: 'test@example.com',
    });

    // Should call onReturnToCheckout, not navigate to MainTabs
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockOnReturnToCheckout).toHaveBeenCalled();
  });

  it('shows error message on profile creation failure', async () => {
    mockCompleteProfile.mockRejectedValue(new Error('Network error'));

    render(<ProfileCreationScreen />);

    const nameInput = screen.getByPlaceholderText('Liam Wilson');
    fireEvent.changeText(nameInput, 'John Doe');

    const phoneInput = screen.getByPlaceholderText('0412 345 678');
    fireEvent.changeText(phoneInput, '0412345678');

    const continueButton = screen.getByText('Continue');
    await act(async () => {
      fireEvent.press(continueButton);
    });

    expect(screen.getByText('Network error')).toBeTruthy();
  });

  it('calls goBack when back button is pressed', () => {
    render(<ProfileCreationScreen />);

    const backButton = screen.getByText('← Back');
    fireEvent.press(backButton);

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('disables continue button when name is empty', () => {
    render(<ProfileCreationScreen />);

    const continueButton = screen.getByText('Continue');
    // The button is a TouchableOpacity wrapping a Text. When disabled,
    // react-native sets accessibilityState.disabled on the TouchableOpacity.
    // We check the parent TouchableOpacity node for the disabled state.
    let current: any = continueButton;
    let disabled = false;
    while (current) {
      if (current.props?.accessibilityState?.disabled === true) {
        disabled = true;
        break;
      }
      current = current.parent;
    }
    expect(disabled).toBe(true);
  });
});