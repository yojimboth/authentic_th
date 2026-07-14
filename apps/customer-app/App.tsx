import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuScreen } from './src/features/menu/components/MenuScreen';
import { CartScreen } from './src/features/cart/components/CartScreen';
import { ProfileScreen } from './src/features/profile/components/ProfileScreen';
import { CheckoutScreen } from './src/features/checkout/components/CheckoutScreen';
import { Utensils, ShoppingCart, User } from 'lucide-react-native';
import { currentConfig } from './src/config/whiteLabelConfig';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={() => (
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
          )} 
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
  );
}
