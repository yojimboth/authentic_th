import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FoodItemCard } from './FoodItemCard';
import { FoodItem } from '../types';

const item: FoodItem = {
  id: '1',
  name: 'Pad Thai',
  description:
    'A long description of the dish that spans multiple lines to verify it gets clamped correctly without crashing the app.',
  price: 12.5,
  spice: 2,
  isAvailable: true,
  imageUrl: 'https://example.com/pad-thai.jpg',
};

describe('FoodItemCard', () => {
  it('renders the item name, price, and description', () => {
    render(<FoodItemCard item={item} onAddToCart={jest.fn()} />);

    expect(screen.getByText('Pad Thai')).toBeTruthy();
    expect(screen.getByText('$12.50')).toBeTruthy();
    expect(screen.getByText(item.description)).toBeTruthy();
  });

  it('truncates the description using numberOfLines instead of the invalid line-clamp-2 className', () => {
    render(<FoodItemCard item={item} onAddToCart={jest.fn()} />);

    const description = screen.getByText(item.description);
    // Regression guard for: 'Expected style "WebkitLineClamp: 2" to contain units'.
    // The className must never re-introduce a web-only `line-clamp-*` utility;
    // truncation must be expressed via the numberOfLines prop instead.
    expect(description.props.numberOfLines).toBe(2);
    expect(String(description.props.className ?? '')).not.toMatch(/line-clamp/);
  });

  it('calls onAddToCart with the item when the Add button is pressed', () => {
    const onAddToCart = jest.fn();
    render(<FoodItemCard item={item} onAddToCart={onAddToCart} />);

    fireEvent.press(screen.getByText('Add'));

    expect(onAddToCart).toHaveBeenCalledWith(item);
  });
});
