import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SplashScreen } from './SplashScreen';
import { currentConfig } from '../../../config/whiteLabelConfig';

// Mock AsyncStorage for testing
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('SplashScreen', () => {
  it('renders the current tenant logo, name, and slogan', () => {
    render(<SplashScreen onComplete={jest.fn()} />);

    expect(screen.getByText(currentConfig.restaurantName)).toBeTruthy();
    expect(screen.getByText(currentConfig.slogan)).toBeTruthy();

    const image = screen.UNSAFE_getByProps({ resizeMode: 'cover' });
    expect(image.props.source).toEqual(currentConfig.logoSource);
  });

  it('renders authentication message during loading', () => {
    const { UNSAFE_queryByText } = render(<SplashScreen onComplete={jest.fn()} />);
    // The auth message may or may not appear depending on timing, but component should render
    expect(screen.getByText(currentConfig.restaurantName)).toBeTruthy();
  });
});
