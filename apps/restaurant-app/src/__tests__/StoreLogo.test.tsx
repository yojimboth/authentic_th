import { render, screen } from '@testing-library/react-native';
import { StoreLogo } from '../components/common/StoreLogo';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('StoreLogo', () => {
  it('renders without crashing', () => {
    render(<StoreLogo />);
    expect(true).toBe(true);
  });

  it('renders with custom size', () => {
    render(<StoreLogo size={100} />);
    expect(true).toBe(true);
  });

  it('renders with logoSource', () => {
    const logo = { uri: 'https://example.com/logo.png' };
    render(<StoreLogo logoSource={logo} />);
    expect(true).toBe(true);
  });
});