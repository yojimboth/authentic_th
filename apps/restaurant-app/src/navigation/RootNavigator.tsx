import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { SplashScreen } from '../features/auth/components/SplashScreen';
import { LoginScreen } from '../features/auth/components/LoginScreen';
import { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen';
import { EditItemScreen } from '../features/menu/screens/EditItemScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import { MainTabsNavigator } from './MainTabsNavigator';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList, MainTabParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useAuthStore();
  const [initializing, setInitializing] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
    setInitializing(false);
  }, []);

  if (initializing || !authChecked) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash">
            {(props) => (
              <SplashScreen
                {...props}
                onComplete={() => {
                  // After splash, token is validated; show Login
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ headerShown: true, headerTitle: 'Order Details' }}
          />
          <Stack.Screen
            name="EditItem"
            component={EditItemScreen}
            options={{ headerShown: true, headerTitle: 'Edit Item' }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: true, headerTitle: 'Edit Profile' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}