import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Utensils, ShoppingCart, Package, User } from 'lucide-react-native';

// Screens
import { SplashScreen } from '../features/auth/components/SplashScreen';
import { AuthChoiceScreen } from '../features/auth/screens/AuthChoiceScreen';
import { AuthScreen } from '../features/auth/screens/AuthScreen';
import { ProfileCreationScreen } from '../features/auth/screens/ProfileCreationScreen';
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
import { useAuthStore } from '../store/useAuthStore';

/**
 * Callback type for screens that need to return to checkout
 * after a user authenticates (member flow).
 */
export type OnReturnToCheckout = () => void;

export type RootStackParamList = {
  Splash: { onComplete: () => void };
  AuthChoice: { onReturnToCheckout: OnReturnToCheckout };
  Auth: { onReturnToCheckout: OnReturnToCheckout };
  ProfileCreation: { email: string; onReturnToCheckout: OnReturnToCheckout };
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
 * RootNavigator manages the top-level navigation state.
 *
 * Guest-first flow:
 * 1. App launch → MainTabs (guest mode)
 * 2. User browses menu, adds items to cart
 * 3. Click checkout → AuthChoiceScreen
 * 4a. Guest → CheckoutScreen
 * 4b. Member → AuthScreen → (ProfileCreation if new) → CheckoutScreen
 *
 * Security: Auth screens are accessible via navigation only;
 * unauthenticated users can browse and use the app as guests.
 */
export function RootNavigator() {
  const authStore = useAuthStore();

  // Initialize auth store on app start (does not block navigation)
  useEffect(() => {
    authStore.initialize();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main app tabs — always accessible (guest or member) */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
      />

      {/* Auth flow screens — only navigated to from Checkout */}
      <Stack.Screen
        name="AuthChoice"
        component={AuthChoiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileCreation"
        component={ProfileCreationScreen}
        options={{ headerShown: false }}
      />

      {/* In-app screens */}
      <Stack.Screen
        name="FoodDetail"
        component={FoodItemDetailScreen}
        options={{ headerShown: true, headerTitle: 'Food Item' }}
      />
      <Stack.Screen
        name="Checkout"
      >
        {(props) => (
          <CheckoutScreen
            {...props}
            onPaymentSuccess={() => {
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
    </Stack.Navigator>
  );
}
