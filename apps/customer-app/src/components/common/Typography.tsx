import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  children: React.ReactNode;
  className?: string;
  /**
   * Truncates text to the given number of lines, forwarded directly to the
   * underlying <Text>. Use this instead of the web-only `line-clamp-*`
   * Tailwind/NativeWind class, which compiles to an invalid RN style
   * (`WebkitLineClamp` without units) and throws at runtime.
   */
  numberOfLines?: number;
  /**
   * Override the font weight for this instance.
   * If not provided, uses the default weight for the variant.
   */
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const defaultWeights = {
  h1: '700' as const,
  h2: '600' as const,
  h3: '500' as const,
  body: '400' as const,
  caption: '400' as const,
};

const weightMap = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const Typography = ({ 
  variant, 
  children, 
  className = '', 
  numberOfLines,
  fontWeight,
}: TypographyProps) => {
  const styles = {
    h1: 'text-3xl leading-tight text-zinc-900',
    h2: 'text-2xl leading-snug text-zinc-900',
    h3: 'text-lg leading-normal text-zinc-900',
    body: 'text-base leading-relaxed text-zinc-700',
    caption: 'text-xs leading-relaxed text-zinc-500',
  };

  const resolvedWeight = fontWeight ? weightMap[fontWeight] : defaultWeights[variant];

  return (
    <Text 
      className={`${styles[variant]} ${className}`} 
      style={{ fontWeight: resolvedWeight }}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};
