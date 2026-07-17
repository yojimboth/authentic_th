import React from 'react';
import { Image, ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';

interface StoreLogoProps {
  /**
   * The restaurant's logo. Pass the `logoSource` from `WhiteLabelConfig`
   * (a static `require()` result) or a remote `{ uri: string }` source.
   * When omitted, a neutral placeholder is shown so the layout never breaks.
   */
  logoSource?: ImageSourcePropType | null;
  /** Rendered width/height in pixels. Defaults to 64. */
  size?: number;
  /** Optional NativeWind className applied to the wrapping View. */
  className?: string;
  /**
   * Inline style applied to the wrapping View. Prefer this over `className`
   * for spacing (margin, etc.) that must reliably reach the rendered node.
   *
   * NativeWind v2 (used in this app) resolves each JSX call site's
   * `className` largely by statically scanning literal class tokens found
   * in the *caller's* source. Composing the class list here via a template
   * literal (`` `items-center justify-center ${className}` ``) means a
   * class passed dynamically through this prop is not reliably applied at
   * runtime — verified: passing `className="mr-6"` produced a rendered
   * style array with `alignItems`/`justifyContent` only, no `marginRight`.
   * That's why bumping `mr-3` -> `mr-4` -> `mr-6` had no visible effect on
   * the Menu header spacing. Use `style` for anything that must land.
   */
  style?: StyleProp<ViewStyle>;
}

const PLACEHOLDER_LOGO: ImageSourcePropType = {
  uri: 'https://via.placeholder.com/150?text=Store+Logo',
};

/**
 * StoreLogo displays the current tenant's restaurant branding (see
 * `whiteLabelConfig.ts`). Falls back to a generic placeholder when no
 * logo source is supplied, so it is always safe to render.
 */
export const StoreLogo: React.FC<StoreLogoProps> = ({
  logoSource,
  size = 64,
  className = '',
  style,
}) => {
  return (
    <View className={`items-center justify-center ${className}`} style={style}>
      <Image
        source={logoSource ?? PLACEHOLDER_LOGO}
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-200"
        resizeMode="cover"
      />
    </View>
  );
};
