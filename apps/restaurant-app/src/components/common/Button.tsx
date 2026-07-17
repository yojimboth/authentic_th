import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, className = '' }: ButtonProps) => {
  const variants = {
    primary: 'bg-brand-primary text-white',
    secondary: 'border-2 border-brand-primary text-brand-primary bg-transparent',
    ghost: 'text-zinc-600 bg-transparent',
    danger: 'bg-rose-500 text-white',
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={loading || disabled}
      className={`px-4 py-3 rounded-lg items-center justify-center ${variants[variant]} ${className}`}
    >
      <Text className={`font-semibold text-base ${variant === 'ghost' ? 'text-zinc-600' : 'text-white'}`}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};