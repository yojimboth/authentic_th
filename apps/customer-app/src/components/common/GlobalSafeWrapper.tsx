import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * GlobalSafeWrapper
 *
 * The single, centralized consumer of the app's one <SafeAreaProvider>
 * (mounted once in App.tsx). Applies safe-area insets on every edge so all
 * screens respect the system safe area, without any screen or component
 * mounting its own SafeAreaProvider — that duplication is what causes the
 * "Tried to register two views with the same name RNCSafeAreaProvider"
 * crash. Do NOT add another <SafeAreaProvider> anywhere else in the tree;
 * this component only renders <SafeAreaView>, a context consumer.
 */
export const GlobalSafeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
};
