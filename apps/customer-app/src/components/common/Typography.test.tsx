import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders its children as text', () => {
    render(<Typography variant="body">Hello world</Typography>);
    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  it('forwards numberOfLines to the underlying Text so callers can truncate without web-only CSS', () => {
    render(
      <Typography variant="caption" numberOfLines={2}>
        A long description that should be clamped to two lines instead of using line-clamp-2.
      </Typography>,
    );

    const text = screen.getByText(
      'A long description that should be clamped to two lines instead of using line-clamp-2.',
    );
    expect(text.props.numberOfLines).toBe(2);
  });

  it('leaves numberOfLines undefined when not provided, so text is not truncated by default', () => {
    render(<Typography variant="h1">Untruncated heading</Typography>);
    const text = screen.getByText('Untruncated heading');
    expect(text.props.numberOfLines).toBeUndefined();
  });
});
