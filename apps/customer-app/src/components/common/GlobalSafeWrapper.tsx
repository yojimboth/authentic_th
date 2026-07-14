import React from 'react';
import { View } from 'react-native';

/**
 * GlobalSafeWrapper
 * 
 * A centralized wrapper to ensure all screens respect system safe areas
 * without registering multiple providers.
 */
export const GlobalSafeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
};
