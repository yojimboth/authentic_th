import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StoreLogo } from './StoreLogo';

describe('StoreLogo', () => {
  it('renders the given logoSource on the underlying Image', () => {
    const logoSource = { uri: 'https://example.com/logo.png' };
    render(<StoreLogo logoSource={logoSource} />);

    const image = screen.UNSAFE_getByProps({ resizeMode: 'cover' });
    expect(image.props.source).toEqual(logoSource);
  });

  it('falls back to a placeholder image when no logoSource is provided', () => {
    render(<StoreLogo />);

    const image = screen.UNSAFE_getByProps({ resizeMode: 'cover' });
    expect(image.props.source).toEqual({
      uri: 'https://via.placeholder.com/150?text=Store+Logo',
    });
  });

  it('applies the requested size to width and height', () => {
    render(<StoreLogo logoSource={{ uri: 'https://example.com/logo.png' }} size={120} />);

    const image = screen.UNSAFE_getByProps({ resizeMode: 'cover' });
    expect(image.props.style).toEqual({ width: 120, height: 120 });
  });

  it('applies a `style` prop (e.g. marginRight) to the wrapping View', () => {
    // Regression test: NativeWind v2 resolves each call site's `className`
    // largely via a static scan of literal class tokens in the caller's
    // source. Because StoreLogo composes its wrapping View's className via
    // a template literal (`items-center justify-center ${className}`), a
    // class name passed dynamically through the `className` prop (e.g.
    // "mr-6") is NOT reliably applied at runtime -- confirmed by inspecting
    // the rendered style array, which contained only the two static
    // classes and no `marginRight`. This is why three rounds of bumping
    // the Menu header's `mr-*` value produced no visible spacing change.
    // `style` bypasses NativeWind's className resolution entirely, so it
    // is the reliable way to pass spacing into this component.
    const { toJSON } = render(
      <StoreLogo
        logoSource={{ uri: 'https://example.com/logo.png' }}
        size={48}
        style={{ marginRight: 24 }}
      />
    );

    const root: any = toJSON();
    const flatStyle = Object.assign({}, ...[].concat(root.props.style));
    expect(flatStyle.marginRight).toBe(24);
  });
});
