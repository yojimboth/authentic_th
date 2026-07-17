import React from 'react';
import { TextInput as RNTextInput, TextInputProps, View, Text } from 'react-native';

interface TextInputComponentProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  className?: string;
}

export const TextInput = ({ label, error, className = '', ...props }: TextInputComponentProps) => {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-zinc-700 mb-1">{label}</Text>
      )}
      <RNTextInput
        className={`px-4 py-3 border rounded-lg text-base bg-white ${
          error ? 'border-red-500' : 'border-zinc-300'
        }`}
        placeholderTextColor="#A1A1AA"
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};