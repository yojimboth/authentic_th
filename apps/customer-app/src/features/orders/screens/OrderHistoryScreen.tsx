import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { useOrders } from '../hooks/useOrders';
import { Order, OrderStatus } from '../types';
import { currentConfig } from '../../../config/whiteLabelConfig';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Preparing': return 'bg-orange-100 text-orange-600';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-600';
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full ${getStatusColor()} self-start`}>
      <Text className={`text-xs font-medium ${getStatusColor().split(' ')[1]}`}>
        {status}
      </Text>
    </View>
  );
};

const OrderCard = ({ order, onPress }: { order: Order; onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm"
    style={{ borderColor: currentConfig.theme.borderColor }}
  >
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-gray-500 text-xs font-medium">{order.id}</Text>
      <StatusBadge status={order.status} />
    </View>
    
    <View className="flex-row justify-between items-end">
      <View>
        <Text className="text-gray-900 font-semibold text-lg">${order.total.toFixed(2)}</Text>
        <Text className="text-gray-400 text-xs">
          {new Date(order.date).toLocaleDateString()} • {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View className="items-end">
        {order.pointsEarned !== undefined && order.pointsEarned > 0 && (
          <View className="flex-row items-center mb-1">
            <Text className="text-yellow-600 text-xs font-bold mr-1">★ {order.pointsEarned} pts</Text>
          </View>
        )}
        <Text style={{ color: currentConfig.theme.primaryColor }} className="text-sm font-medium">
          View Details →
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export const OrderHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator color={currentConfig.theme.primaryColor} />
      </View>
    );
  }

  const activeOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Out for Delivery');
  const pastOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6">My Orders</Text>
      
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-700 mb-4">Active Orders</Text>
        {activeOrders.length > 0 ? (
          activeOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })} 
            />
          ))
        ) : (
          <Text className="text-gray-500 italic text-center py-4">No active orders at the moment</Text>
        )}
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-700 mb-4">Past Orders</Text>
        {pastOrders.length > 0 ? (
          pastOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })} 
            />
          ))
        ) : (
          <Text className="text-gray-500 italic text-center py-4">No past orders found</Text>
        )}
      </View>
    </View>
  );
};
