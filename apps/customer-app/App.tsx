import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalSafeWrapper } from './src/components/common/GlobalSafeWrapper';
import { RootNavigator } from './src/navigation/RootNavigator';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalSafeWrapper>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GlobalSafeWrapper>
    </SafeAreaProvider>
  );
}

