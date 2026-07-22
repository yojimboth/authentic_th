import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading order...</Text>
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
  const isReadyAction = ['Preparing', 'Ready'].includes(order.status);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <Text style={styles.orderTitle}>
            Order #{order.id.toUpperCase().replace('ORD-', '')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Order Status</Text>
          <View style={styles.statusRow}>
            <OrderStatusBadge status={order.status} />
            <Text style={styles.updatedText}>
              Updated {formatRelativeTime(order.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Order Items Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(order.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee</Text>
              <Text style={styles.totalValue}>{formatCurrency(order.deliveryFee)}</Text>
            </View>
            {order.loyaltyDiscount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Loyalty Discount</Text>
                <Text style={styles.discountValue}>-{formatCurrency(order.loyaltyDiscount)}</Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(order.total)}</Text>
            </View>
          </View>
        </View>

        {/* Customer Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Info</Text>
          {order.customerName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{order.customerName}</Text>
            </View>
          )}
          {order.customerPhone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{order.customerPhone}</Text>
            </View>
          )}
          {order.deliveryAddress && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={[styles.infoValue, styles.infoValueFlex]}>{order.deliveryAddress}</Text>
            </View>
          )}
        </View>

        {/* Special Notes Card */}
        {order.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Special Notes</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}

        {/* Action Button */}
        {actionButton && !['Completed', 'Cancelled'].includes(order.status) && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() =>
                showConfirmation('Confirm Action', `Are you sure you want to ${actionButton.text.toLowerCase()}?`, () =>
                  handleAction(actionButton.action)
                )
              }
              disabled={actionLoading}
              style={[
                styles.actionButton,
                isReadyAction ? styles.actionButtonSuccess : styles.actionButtonPrimary,
                actionLoading && styles.actionButtonDisabled,
              ]}
            >
              <Text style={styles.actionButtonText}>
                {actionLoading ? 'Processing...' : actionButton.text}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 12,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  headerSpacer: {
    width: 64,
  },
  scrollContent: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  updatedText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111827',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 12,
    paddingTop: 12,
  },
  totalsContainer: {
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
    fontFamily: 'Inter-Medium',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 6,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  infoValueFlex: {
    flex: 1,
  },
  notesText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  actionButtonPrimary: {
    backgroundColor: '#4F46E5',
  },
  actionButtonSuccess: {
    backgroundColor: '#10B981',
  },
  actionButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  bottomSpacer: {
    height: 16,
  },
});