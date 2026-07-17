import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOrders } from '../hooks/useOrders';
import { currentConfig } from '../../../config/whiteLabelConfig';
import { Button } from '../../../components/common/Button';
import { getCurrentUserId } from '../../../utils/mockAuth';

export const OrderStatusDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as { orderId: string };
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator color={currentConfig.theme.primaryColor} />
      </View>
    );
  }

  const order = orders.find(o => o.id === orderId);

  // Security: Order not found
  if (!order) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-center text-gray-500">Order not found</Text>
        <Button 
          title="Back to Orders" 
          onPress={() => navigation.goBack()} 
          className="mt-4"
        />
      </View>
    );
  }

  // Security: IDOR Protection - Verify order belongs to current user
  const currentUserId = getCurrentUserId();
  if (order.userId !== currentUserId) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-center text-red-500 font-bold">Access Denied</Text>
        <Text className="text-center text-gray-500 mt-2">
          You don't have permission to view this order.
        </Text>
        <Button 
          title="Back to Orders" 
          onPress={() => navigation.goBack()} 
          className="mt-4"
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="mb-4 self-start"
        >
          <Text style={{ color: currentConfig.theme.primaryColor }} className="text-sm font-medium">
            ← Back to Orders
          </Text>
        </TouchableOpacity>

        <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-gray-500 text-xs mb-1">Order ID</Text>
              <Text className="text-lg font-bold text-gray-900">{order.id}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full bg-orange-100`}>
              <Text className="text-orange-600 text-xs font-bold">{order.status}</Text>
            </View>
          </View>

           <View className="flex-row justify-between py-4 border-t border-b border-gray-50 my-4">
             <View>
               <Text className="text-gray-500 text-xs mb-1">Date</Text>
               <Text className="text-sm font-medium text-gray-900">
                 {new Date(order.date).toLocaleDateString()}
               </Text>
             </View>
             <View className="items-end">
               <Text className="text-gray-500 text-xs mb-1">Total Amount</Text>
               <Text className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</Text>
             </View>
           </View>

           <View className="flex-row justify-between items-center bg-yellow-50 p-3 rounded-xl mb-4 border border-yellow-100">
             <Text className="text-yellow-700 text-sm font-medium">Points Earned</Text>
             <Text className="text-yellow-700 font-bold">{order.pointsEarned || 0} pts</Text>
           </View>

           <View className="mb-4">
             <Text className="text-gray-500 text-xs mb-2">Delivery Address</Text>
            <Text className="text-sm text-gray-600">{order.deliveryAddress}</Text>
          </View>
        </View>

        <Text className="text-lg font-semibold text-gray-800 mb-4">Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-3 border border-gray-100">
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-medium">{item.name}</Text>
              <Text className="text-gray-400 mx-2 text-sm">x{item.quantity}</Text>
            </View>
            <Text className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <View className="bg-white p-4 rounded-xl border border-gray-100 mt-4 flex-row justify-between items-center">
          <Text className="text-gray-500 font-medium">Grand Total</Text>
          <Text className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
