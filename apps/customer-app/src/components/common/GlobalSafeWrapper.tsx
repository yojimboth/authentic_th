import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * GlobalSafeWrapper
 * 
 * A centralized wrapper to ensure all screens respect system safe areas
 * without registering multiple providers.
 */
export const GlobalSafeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {children}
    </SafeAreaView>
  );
};
