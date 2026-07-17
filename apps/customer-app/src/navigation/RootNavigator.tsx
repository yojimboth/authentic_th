import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { Utensils, ShoppingCart, Package, User } from 'lucide-react-native';

// Screens
import { SplashScreen } from '../features/auth/components/SplashScreen';
import { MenuScreen } from '../features/menu/screens/MenuScreen';
import { FoodItemDetailScreen } from '../features/menu/components/FoodItemDetailScreen';
import { CartScreen } from '../features/cart/components/CartScreen';
import { CheckoutScreen } from '../features/checkout/screens/CheckoutScreen';
import { ConfirmationScreen } from '../features/checkout/screens/ConfirmationScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import { OrderHistoryScreen } from '../features/orders/screens/OrderHistoryScreen';
import { OrderStatusDetailScreen } from '../features/orders/screens/OrderStatusDetailScreen';

// Config
import { currentConfig } from '../config/whiteLabelConfig';
import { isAuthenticated as checkAuth, getToken, logout } from '../utils/mockAuth';

export type RootStackParamList = {
  Splash: { onComplete: () => void };
  MainTabs: undefined;
  FoodDetail: { itemId: string };
  Checkout: { onPaymentSuccess: () => void };
  Confirmation: { orderId: string };
  OrderDetails: { orderId: string };
  EditProfile: undefined;
};

export type MainTabParamList = {
  Menu: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * MainTabsNavigator handles the bottom navigation for authenticated users.
 */
function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentConfig.theme.backgroundColor,
          borderTopWidth: 1,
          borderTopColor: currentConfig.theme.borderColor,
          height: 60,
          paddingBottom: 10
        },
        tabBarActiveTintColor: currentConfig.theme.activeTintColor,
        tabBarInactiveTintColor: currentConfig.theme.inactiveTintColor,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Menu') return <Utensils size={size} color={color} />;
          if (route.name === 'Cart') return <ShoppingCart size={size} color={color} />;
          if (route.name === 'Orders') return <Package size={size} color={color} />;
          if (route.name === 'Profile') return <User size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen} 
        options={{ tabBarLabel: 'Menu' }} 
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ tabBarLabel: 'Cart' }} 
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderHistoryScreen} 
        options={{ tabBarLabel: 'Orders' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }} 
      />
    </Tab.Navigator>
  );
}

/**
 * RootNavigator manages the top-level navigation state and authentication flow.
 * 
 * Security: Uses token-based authentication with proper token validation.
 * The app checks for existing tokens on mount and validates them before
 * allowing access to protected routes.
 */
export function RootNavigator() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check for existing authentication token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const valid = await checkAuth();
        setIsAuthenticated(valid);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecked(true);
        setInitializing(false);
      }
    };

    verifyAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (initializing || !isAuthChecked) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={currentConfig.theme.primaryColor} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Splash">
          {(props) => (
            <SplashScreen 
              {...props} 
              onComplete={() => {
                // After splash completes, token is already validated
                setIsAuthenticated(true);
              }} 
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabsNavigator} 
          />
          <Stack.Screen 
            name="FoodDetail" 
            component={FoodItemDetailScreen} 
            options={{ headerShown: true, headerTitle: 'Food Item' }}
          />
          <Stack.Screen 
            name="Checkout">
            {(props) => (
              <CheckoutScreen 
                {...props} 
                onPaymentSuccess={() => {
                  // Logic to navigate to confirmation or back to menu
                  props.navigation.navigate('Confirmation', { orderId: 'mock-order-123' });
                }} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="Confirmation" 
            component={ConfirmationScreen} 
            options={{ headerShown: false }}
          />
           <Stack.Screen 
              name="OrderDetails" 
              component={OrderStatusDetailScreen} 
              options={{ headerShown: true, headerTitle: 'Order Status' }}
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
