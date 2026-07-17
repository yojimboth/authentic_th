import React from 'react';
import { View, Text } from 'react-native';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  Pending: { bg: 'bg-orange-100', text: 'text-orange-600' },
  Accepted: { bg: 'bg-blue-100', text: 'text-blue-600' },
  Preparing: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  Ready: { bg: 'bg-green-100', text: 'text-green-600' },
  Completed: { bg: 'bg-gray-100', text: 'text-gray-600' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-600' },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const style = statusStyles[status] || statusStyles.Pending;
  return (
    <View className={`px-2.5 py-1 rounded-full ${style.bg}`}>
      <Text className={`text-xs font-semibold ${style.text}`}>{status}</Text>
    </View>
  );
};