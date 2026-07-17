import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MenuScreen } from './MenuScreen';
import { currentConfig } from '../../../config/whiteLabelConfig';

jest.mock('../hooks/useMenu', () => ({
  useMenu: () => ({
    state: { status: 'success', data: [] },
    refresh: jest.fn(),
  }),
}));

jest.mock('../../../store/useCartStore', () => ({
  useCartStore: () => jest.fn(),
}));

describe('MenuScreen', () => {
  it('renders the current tenant logo alongside the restaurant name', () => {
    render(<MenuScreen />);

    expect(screen.getByText(currentConfig.restaurantName)).toBeTruthy();

    const image = screen.UNSAFE_getByProps({ resizeMode: 'cover' });
    expect(image.props.source).toEqual(currentConfig.logoSource);
  });
});
