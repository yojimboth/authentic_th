import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Package, UtensilsCrossed, BarChart3, UserCircle } from 'lucide-react-native';
import { RouteProp } from '@react-navigation/native';
import { OrdersScreen } from '../features/orders/screens/OrdersScreen';
import { MenuScreen } from '../features/menu/screens/MenuScreen';
import { AnalyticsScreen } from '../features/analytics/screens/AnalyticsScreen';
import { ProfileScreen } from '../features/profile/components/ProfileScreen';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<MainTabParamList, keyof MainTabParamList> }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#71717A',
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Orders') return <Package size={size} color={color} />;
          if (route.name === 'Menu') return <UtensilsCrossed size={size} color={color} />;
          if (route.name === 'Analytics') return <BarChart3 size={size} color={color} />;
          if (route.name === 'Profile') return <UserCircle size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarLabel: 'Menu' }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarLabel: 'Analytics' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}