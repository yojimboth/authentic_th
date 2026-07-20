import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FoodItem } from '../../features/menu/types';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) => {
  const variants = {
    primary: 'bg-brand-primary text-white',
    secondary: 'border-2 border-brand-primary text-brand-primary bg-transparent',
    ghost: 'text-zinc-600 bg-transparent',
    danger: 'bg-rose-500 text-white',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-lg items-center justify-center ${variants[variant]} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading ? (
        <Text className="text-white">Loading...</Text>
      ) : (
        <Text
          className={`font-semibold ${variant === 'ghost' ? 'text-zinc-600' : 'text-white'}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
