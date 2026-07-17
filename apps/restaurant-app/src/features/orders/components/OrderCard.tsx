import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  onAccept?: () => void;
  onPrepare?: () => void;
  onComplete?: () => void;
  showActions?: boolean;
}

export const OrderCard = ({ order, onPress, onAccept, onPrepare, onComplete, showActions = true }: OrderCardProps) => {
  const activeStatuses = ['Pending', 'Accepted', 'Preparing', 'Ready'];
  const isActive = activeStatuses.includes(order.status);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 border border-zinc-200"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-bold text-zinc-900">
          {order.id.toUpperCase().replace('ORD-', 'ORD-')}
        </Text>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text className="text-sm text-zinc-700 mb-1" numberOfLines={1}>
        {order.items.slice(0, 2).map((item) => `${item.name} x${item.quantity}`).join(', ')}
        {order.items.length > 2 && (
          <Text className="text-zinc-400"> +{order.items.length - 2} more</Text>
        )}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-zinc-900">
          {formatCurrency(order.total)}
        </Text>
        <Text className="text-xs text-zinc-400">
          {formatRelativeTime(order.createdAt)}
        </Text>
      </View>

      {showActions && isActive && (
        <View className="flex-row mt-3 gap-2">
          {order.status === 'Pending' && onAccept && (
            <TouchableOpacity
              onPress={onAccept}
              className="flex-1 bg-brand-primary py-2 rounded-lg items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-semibold">Accept</Text>
            </TouchableOpacity>
          )}
          {order.status === 'Accepted' && onPrepare && (
            <TouchableOpacity
              onPress={onPrepare}
              className="flex-1 bg-brand-primary py-2 rounded-lg items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-semibold">Prepare</Text>
            </TouchableOpacity>
          )}
          {(order.status === 'Preparing' || order.status === 'Ready') && onComplete && (
            <TouchableOpacity
              onPress={onComplete}
              className="flex-1 bg-brand-success py-2 rounded-lg items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-semibold">
                {order.status === 'Preparing' ? 'Complete' : 'Complete'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onPress}
            className="flex-1 border border-zinc-300 py-2 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Text className="text-zinc-600 text-sm font-semibold">Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};