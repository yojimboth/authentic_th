import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  children: React.ReactNode;
  className?: string;
}

export const Typography = ({ variant, children, className = '' }: TypographyProps) => {
  const styles = {
    h1: 'text-3xl font-bold leading-tight text-zinc-900',
    h2: 'text-2xl font-semibold leading-snug text-zinc-900',
    h3: 'text-lg font-medium leading-normal text-zinc-900',
    body: 'text-base font-normal leading-relaxed text-zinc-700',
    caption: 'text-xs font-normal text-zinc-500',
  };

  return <Text className={`${styles[variant]} ${className}`}>{children}</Text>;
};
