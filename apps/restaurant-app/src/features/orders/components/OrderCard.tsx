import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
      style={styles.card}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>
          {order.id.toUpperCase()}
        </Text>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text style={styles.itemsText} numberOfLines={1}>
        {order.items.slice(0, 2).map((item) => `${item.name} x${item.quantity}`).join(', ')}
        {order.items.length > 2 && (
          <Text style={styles.moreText}> +{order.items.length - 2} more</Text>
        )}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.totalText}>
          {formatCurrency(order.total)}
        </Text>
        <Text style={styles.timeText}>
          {formatRelativeTime(order.createdAt)}
        </Text>
      </View>

      {showActions && isActive && (
        <View style={styles.actionsRow}>
          {order.status === 'Pending' && onAccept && (
            <TouchableOpacity
              onPress={onAccept}
              style={[styles.actionButton, styles.primaryButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
          {order.status === 'Accepted' && onPrepare && (
            <TouchableOpacity
              onPress={onPrepare}
              style={[styles.actionButton, styles.primaryButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Prepare</Text>
            </TouchableOpacity>
          )}
          {(order.status === 'Preparing' || order.status === 'Ready') && onComplete && (
            <TouchableOpacity
              onPress={onComplete}
              style={[styles.actionButton, styles.successButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>
                Complete
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onPress}
            style={[styles.actionButton, styles.secondaryButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  itemsText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  moreText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  successButton: {
    backgroundColor: '#10B981',
  },
  successButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: 'Inter-SemiBold',
  },
});