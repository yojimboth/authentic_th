import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { AuthScreen } from './AuthScreen';

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
    params: { onReturnToCheckout: mockOnReturnToCheckout },
  }),
  useIsFocused: () => true,
  useFocusEffect: jest.fn(),
}));

// Mock auth store
const mockRequestCode = jest.fn();
const mockVerifyCode = jest.fn();
jest.mock('../../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    requestCode: mockRequestCode,
    verifyCode: mockVerifyCode,
  }),
}));

/** Find the hidden code TextInput by testID. */
const findCodeInput = () => screen.getByTestId('code-input');

describe('AuthScreen', () => {
  beforeEach(() => {
    mockRequestCode.mockReset();
    mockVerifyCode.mockReset();
    mockReplace.mockClear();
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    mockOnReturnToCheckout.mockClear();
  });

  // ─── Step 1: Email Entry ────────────────────────────────────

  it('renders the email entry step with title and placeholder', () => {
    render(<AuthScreen />);

    expect(screen.getByText('Enter Email')).toBeTruthy();
    expect(
      screen.getByText("Enter the email address we'll send a code to")
    ).toBeTruthy();

    const emailInput = screen.getByPlaceholderText('email@example.com');
    expect(emailInput).toBeTruthy();
  });

  it('renders the Send Code button', () => {
    render(<AuthScreen />);
    expect(screen.getByText('Send Code')).toBeTruthy();
  });

  it('shows validation error for invalid email', async () => {
    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'not-an-email');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('navigates to code step on valid email', async () => {
    mockRequestCode.mockResolvedValue({ sent: true });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    expect(mockRequestCode).toHaveBeenCalledWith('test@example.com');
    expect(screen.getByText('Verification Code')).toBeTruthy();
    expect(screen.queryByText('Enter Email')).toBeNull();
  });

  it('shows error when requestCode fails', async () => {
    mockRequestCode.mockResolvedValue({ error: 'Server error' });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    expect(screen.getByText('Server error')).toBeTruthy();
  });

  // ─── Step 2: Code Entry ─────────────────────────────────────

  it('renders 6 code input boxes and email in code step', async () => {
    mockRequestCode.mockResolvedValue({ sent: true });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    expect(screen.getByText('Verification Code')).toBeTruthy();
    expect(
      screen.getByText(/We sent a code to test@example\.com/)
    ).toBeTruthy();
  });

  it('shows error when verification code is invalid', async () => {
    mockVerifyCode.mockResolvedValue({ error: 'Invalid verification code' });
    mockRequestCode.mockResolvedValue({ sent: true });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    // Enter 6 digits via the hidden code input
    const codeInput = findCodeInput();
    await act(async () => {
      fireEvent.changeText(codeInput, '000000');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Verify'));
    });

    expect(
      screen.getByText('Invalid verification code')
    ).toBeTruthy();
  });

  it('navigates to ProfileCreation when requiresProfile is true', async () => {
    mockRequestCode.mockResolvedValue({ sent: true });
    mockVerifyCode.mockResolvedValue({ requiresProfile: true });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'new@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    const codeInput = findCodeInput();
    await act(async () => {
      fireEvent.changeText(codeInput, '123456');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Verify'));
    });

    expect(mockVerifyCode).toHaveBeenCalledWith('new@example.com', '123456');
    expect(mockReplace).toHaveBeenCalledWith('ProfileCreation', {
      email: 'new@example.com',
      onReturnToCheckout: expect.any(Function),
    });
  });

  it('calls onReturnToCheckout when verification succeeds for existing user', async () => {
    mockRequestCode.mockResolvedValue({ sent: true });
    mockVerifyCode.mockResolvedValue({ requiresProfile: false });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'existing@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    const codeInput = findCodeInput();
    await act(async () => {
      fireEvent.changeText(codeInput, '123456');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Verify'));
    });

    expect(mockOnReturnToCheckout).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('allows going back to email step from code step', async () => {
    mockRequestCode.mockResolvedValue({ sent: true });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    await act(async () => {
      fireEvent.press(screen.getByText('← Back'));
    });

    expect(screen.getByText('Enter Email')).toBeTruthy();
    expect(screen.queryByText('Verification Code')).toBeNull();
  });

  it('clears code and error when navigating back to email', async () => {
    mockVerifyCode.mockResolvedValue({ error: 'Bad code' });
    mockRequestCode.mockResolvedValue({ sent: true });

    render(<AuthScreen />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Send Code'));
    });

    // Cause a verification error
    const codeInput = findCodeInput();
    await act(async () => {
      fireEvent.changeText(codeInput, '123456');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Verify'));
    });

    expect(screen.getByText('Bad code')).toBeTruthy();

    // Go back to email
    await act(async () => {
      fireEvent.press(screen.getByText('← Back'));
    });

    expect(screen.queryByText('Bad code')).toBeNull();
    expect(screen.getByText('Enter Email')).toBeTruthy();
  });
});