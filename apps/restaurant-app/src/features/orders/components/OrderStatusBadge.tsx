import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Accepted: { bg: '#DBEAFE', text: '#1E40AF' },
  Preparing: { bg: '#FEF9C3', text: '#854D0E' },
  Ready: { bg: '#D1FAE5', text: '#065F46' },
  Completed: { bg: '#F3F4F6', text: '#374151' },
  Cancelled: { bg: '#FFE4E6', text: '#991B1B' },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const style = statusStyles[status] || statusStyles.Pending;
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.statusText, { color: style.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});