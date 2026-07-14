import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalSafeWrapper } from './src/components/common/GlobalSafeWrapper';
import { MenuScreen } from './src/features/menu/components/MenuScreen';
import { CartScreen } from './src/features/cart/components/CartScreen';
import { ProfileScreen } from './src/features/profile/components/ProfileScreen';
import { CheckoutScreen } from './src/features/checkout/components/CheckoutScreen';
import { Utensils, ShoppingCart, User } from 'lucide-react-native';
import { currentConfig } from './src/config/whiteLabelConfig';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Extracted to a stable, named component rather than an inline function
// passed as `component={() => (...)}`. React Navigation treats the
// `component` prop's identity as the screen's component type; an inline
// arrow function is a brand-new function (and thus a brand-new component
// type) on every render of the parent, which unmounts/remounts the entire
// tab navigator and resets its navigation state (selected tab, tab-level
// history) on every re-render of <App />.
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
          if (route.name === 'Menu') {
            return <Utensils size={size} color={color} />;
          }
          if (route.name === 'Cart') {
            return <ShoppingCart size={size} color={color} />;
          }
          if (route.name === 'Profile') {
            return <User size={size} color={color} />;
          }
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
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalSafeWrapper>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MainTabs"
              component={MainTabsNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Checkout">
              {(props) => (
                <CheckoutScreen 
                  {...props} 
                  onPaymentSuccess={() => {
                    props.navigation.navigate('MainTabs', { screen: 'Menu' });
                  }} 
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalSafeWrapper>
    </SafeAreaProvider>
  );
}
