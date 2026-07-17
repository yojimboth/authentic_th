import { render, screen, waitFor } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('AnalyticsScreen', () => {
  it('renders the screen title', async () => {
    const { AnalyticsScreen } = require('../features/analytics/screens/AnalyticsScreen');
    render(<AnalyticsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeTruthy();
    });
  });
});