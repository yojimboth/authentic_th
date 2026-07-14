import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuScreen } from './src/features/menu/components/MenuScreen';
import { CartScreen } from './src/features/cart/components/CartScreen';
import { ProfileScreen } from './src/features/profile/components/ProfileScreen';
import { Utensils, ShoppingCart, User } from 'lucide-react-native';
import { currentConfig } from './src/config/whiteLabelConfig';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
