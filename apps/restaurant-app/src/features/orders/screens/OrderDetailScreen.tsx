import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

type OrderDetailScreenProps = StackScreenProps<RootStackParamList, 'OrderDetail'>;

export const OrderDetailScreen = ({ navigation, route }: OrderDetailScreenProps) => {
  const { orderId } = route.params;
  const { orders, isLoading, acceptOrder, prepareOrder, completeOrder } = useOrders();
  const [actionLoading, setActionLoading] = useState(false);

  const order = orders.find((o) => o.id === orderId) || null;

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-zinc-500 mt-2">Loading order...</Text>
      </View>
    );
  }

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: onConfirm },
    ]);
  };

  const handleAction = async (action: 'accept' | 'prepare' | 'complete') => {
    setActionLoading(true);
    try {
      if (action === 'accept') await acceptOrder(order.id);
      else if (action === 'prepare') await prepareOrder(order.id);
      else if (action === 'complete') await completeOrder(order.id);
      Alert.alert('Success', `Order ${action === 'accept' ? 'accepted' : action === 'prepare' ? 'preparing' : 'completed'}!`);
    } catch (err) {
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const getActionButton = () => {
    const base = {
      Pending: { text: 'Accept Order', action: 'accept' as const },
      Accepted: { text: 'Start Preparing', action: 'prepare' as const },
      Preparing: { text: 'Mark as Ready', action: 'complete' as const },
      Ready: { text: 'Complete Order', action: 'complete' as const },
    };
    return base[order.status] || null;
  };

  const actionButton = getActionButton();

  return (
    <View className="flex-1 bg-zinc-50">
      <View className="bg-white px-4 pt-4 pb-3 border-b border-zinc-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="py-2">
            <Text className="text-brand-primary text-base font-semibold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-base font-bold text-zinc-900">
            Order #{order.id.toUpperCase().replace('ORD-', '')}
          </Text>
          <View className="w-16" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
          <Text className="text-sm font-medium text-zinc-500 mb-2">Order Status</Text>
          <View className="flex-row items-center justify-between">
            <OrderStatusBadge status={order.status} />
            <Text className="text-xs text-zinc-400">
              Updated {formatRelativeTime(order.updatedAt)}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
          <Text className="text-base font-semibold text-zinc-900 mb-3">Order Items</Text>
          {order.items.map((item, index) => (
            <View key={item.id} className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-base text-zinc-900">{item.name}</Text>
                <Text className="text-sm text-zinc-500">x{item.quantity}</Text>
              </View>
              <Text className="text-base font-medium text-zinc-900">
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View className="border-t border-zinc-200 mt-3 pt-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm text-zinc-600">Subtotal</Text>
              <Text className="text-sm text-zinc-900">{formatCurrency(order.subtotal)}</Text>
            </View>
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm text-zinc-600">Delivery Fee</Text>
              <Text className="text-sm text-zinc-900">{formatCurrency(order.deliveryFee)}</Text>
            </View>
            {order.loyaltyDiscount > 0 && (
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm text-zinc-600">Loyalty Discount</Text>
                <Text className="text-sm text-brand-success">-{formatCurrency(order.loyaltyDiscount)}</Text>
              </View>
            )}
            <View className="flex-row items-center justify-between pt-2 border-t border-zinc-200">
              <Text className="text-base font-bold text-zinc-900">Total</Text>
              <Text className="text-base font-bold text-zinc-900">{formatCurrency(order.total)}</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
          <Text className="text-base font-semibold text-zinc-900 mb-3">Customer Info</Text>
          {order.customerName && (
            <View className="flex-row items-center mb-1">
              <Text className="text-sm text-zinc-500 w-20">Name:</Text>
              <Text className="text-sm text-zinc-900">{order.customerName}</Text>
            </View>
          )}
          {order.customerPhone && (
            <View className="flex-row items-center mb-1">
              <Text className="text-sm text-zinc-500 w-20">Phone:</Text>
              <Text className="text-sm text-zinc-900">{order.customerPhone}</Text>
            </View>
          )}
          {order.deliveryAddress && (
            <View className="flex-row items-start mt-1">
              <Text className="text-sm text-zinc-500 w-20">Address:</Text>
              <Text className="text-sm text-zinc-900 flex-1">{order.deliveryAddress}</Text>
            </View>
          )}
        </View>

        {order.notes && (
          <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
            <Text className="text-base font-semibold text-zinc-900 mb-2">Special Notes</Text>
            <Text className="text-sm text-zinc-700">{order.notes}</Text>
          </View>
        )}

        {actionButton && !['Completed', 'Cancelled'].includes(order.status) && (
          <View className="mb-8">
            <TouchableOpacity
              onPress={() =>
                showConfirmation('Confirm Action', `Are you sure you want to ${actionButton.text.toLowerCase()}?`, () =>
                  handleAction(actionButton.action)
                )
              }
              disabled={actionLoading}
              className={`py-4 rounded-xl items-center ${
                ['Preparing', 'Ready'].includes(order.status) ? 'bg-brand-success' : 'bg-brand-primary'
              }`}
            >
              <Text className="text-white text-base font-semibold">
                {actionLoading ? 'Processing...' : actionButton.text}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};