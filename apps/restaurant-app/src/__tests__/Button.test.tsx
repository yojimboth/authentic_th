import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/common/Button';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('Button', () => {
  it('renders with title', () => {
    render(<Button title="Test Button" onPress={() => {}} />);
    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Press Me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button title="Submit" onPress={() => {}} loading={true} />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    render(<Button title="Submit" onPress={onPress} loading={true} />);
    fireEvent.press(screen.getByText('Loading...'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" onPress={onPress} disabled={true} />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders ghost variant', () => {
    const onPress = jest.fn();
    render(<Button title="Ghost" onPress={onPress} variant="ghost" />);
    expect(screen.getByText('Ghost')).toBeTruthy();
  });

  it('renders danger variant', () => {
    render(<Button title="Danger" onPress={() => {}} variant="danger" />);
    expect(screen.getByText('Danger')).toBeTruthy();
  });
});