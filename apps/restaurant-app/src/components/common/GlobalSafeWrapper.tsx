import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const GlobalSafeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
};