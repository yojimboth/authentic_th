import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useOrders } from '../hooks/useOrders';
import { currentConfig } from '../../../config/whiteLabelConfig';
import { getCurrentUserId } from '../../../utils/mockAuth';
import { Order, OrderStatus } from '../types';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Preparing': return { bg: '#FEF3C7', text: '#92400E', borderColor: '#FCD34D' };
      case 'Out for Delivery': return { bg: '#DBEAFE', text: '#1E40AF', borderColor: '#60A5FA' };
      case 'Ready': return { bg: '#D1FAE5', text: '#065F46', borderColor: '#34D399' };
      case 'Completed': return { bg: '#D1FAE5', text: '#065F46', borderColor: '#34D399' };
      case 'Cancelled': return { bg: '#FFE4E6', text: '#991B1B', borderColor: '#F87171' };
      default: return { bg: '#F4F4F5', text: '#3F3F46', borderColor: '#D4D4D8' };
    }
  };

  const style = getStatusStyle();

  return (
    <View style={{ 
      paddingHorizontal: 12, 
      paddingVertical: 6, 
      borderRadius: 20, 
      backgroundColor: style.bg,
      borderWidth: 1,
      borderColor: style.borderColor,
    }}>
      <Text style={{ 
        fontSize: 12, 
        fontWeight: '600', 
        color: style.text 
      }}>
        {status}
      </Text>
    </View>
  );
};

const StatusProgress = ({ status }: { status: OrderStatus }) => {
  const getSteps = () => {
    switch (status) {
      case 'Preparing':
        return [
          { label: 'Order Placed', active: true },
          { label: 'Preparing', active: true },
          { label: 'Out for Delivery', active: false },
          { label: 'Delivered', active: false },
        ];
      case 'Out for Delivery':
        return [
          { label: 'Order Placed', active: true },
          { label: 'Preparing', active: true },
          { label: 'Out for Delivery', active: true },
          { label: 'Delivered', active: false },
        ];
      case 'Ready':
        return [
          { label: 'Order Placed', active: true },
          { label: 'Preparing', active: true },
          { label: 'Ready for Pickup', active: true },
          { label: 'Completed', active: false },
        ];
      case 'Completed':
        return [
          { label: 'Order Placed', active: true },
          { label: 'Preparing', active: true },
          { label: 'Out for Delivery', active: true },
          { label: 'Delivered', active: true },
        ];
      default:
        return [];
    }
  };

  const steps = getSteps();
  if (steps.length === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      {steps.map((step, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: index < steps.length - 1 ? 20 : 0 }}>
          <View style={{ alignItems: 'center', marginRight: 16 }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: step.active ? currentConfig.theme.primaryColor : '#E4E4E7',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                color: step.active ? '#FFFFFF' : '#71717A',
                fontSize: 14,
                fontWeight: '700',
              }}>
                {index + 1}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={{
                width: 2,
                height: 24,
                backgroundColor: step.active ? currentConfig.theme.primaryColor : '#E4E4E7',
                marginTop: 4,
              }} />
            )}
          </View>
          <Text style={{
            fontSize: 14,
            fontWeight: step.active ? '600' : '400',
            color: step.active ? '#18181B' : '#71717A',
          }}>
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const OrderStatusDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as { orderId: string };
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentConfig.theme.primaryColor} />
      </View>
    );
  }

  const order = orders.find(o => o.id === orderId);

  // Security: Order not found
  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // SECURITY: In production, server-side authorization MUST verify order ownership.
  // Client-side checks alone are insufficient against a malicious backend or API manipulation.
  // The backend must implement:
  //   1. Authentication (verify user token)
  //   2. Authorization (verify order belongs to authenticated user)
  //   3. Input validation (sanitize orderId parameter)
  // See: CWE-639 (Authorization Bypass Through User-Controlled Key)
  const currentUserId = getCurrentUserId();
  if (order.userId !== currentUserId && order.userId !== '__CURRENT_USER__') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTextBold}>Access Denied</Text>
        <Text style={styles.errorText}>You don't have permission to view this order.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isPickup = !order.deliveryAddress;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Order Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
            </View>
            <StatusBadge status={order.status} />
          </View>

          <View style={styles.headerDetails}>
            <View>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formatDate(order.date)}</Text>
              <Text style={styles.time}>{formatTime(order.date)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>Total Amount</Text>
              <Text style={styles.total}>${order.total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Status Progress */}
          {order.status !== 'Cancelled' && (
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Order Progress</Text>
              <StatusProgress status={order.status} />
              
              {/* Estimated Delivery */}
              {order.estimatedDelivery && order.status !== 'Completed' && (
                <View style={styles.etaCard}>
                  <Text style={styles.etaLabel}>Estimated Time</Text>
                  <Text style={styles.etaValue}>{order.estimatedDelivery}</Text>
                </View>
              )}
            </View>
          )}

          {/* Cancellation Reason */}
          {order.status === 'Cancelled' && order.cancellationReason && (
            <View style={styles.cancellationCard}>
              <Text style={styles.cancellationTitle}>Cancellation Reason</Text>
              <Text style={styles.cancellationReason}>{order.cancellationReason}</Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              <Text style={styles.itemUnitPrice}>${item.price.toFixed(2)} each</Text>
            </View>
          ))}
        </View>

        {/* Delivery Information */}
        {!isPickup && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
            </View>
          </View>
        )}

        {isPickup && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Information</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Pickup Type</Text>
              <Text style={styles.infoValue}>Self Pickup</Text>
            </View>
          </View>
        )}

        {/* Loyalty Points */}
        {order.pointsEarned && order.pointsEarned > 0 && (
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>Loyalty Points Earned</Text>
            <Text style={styles.pointsValue}>★ {order.pointsEarned} points</Text>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {order.status !== 'Cancelled' && (
          <View style={styles.actions}>
            {order.status === 'Completed' && (
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Reorder</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorTextBold: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    marginTop: 4,
  },
  headerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  label: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
  },
  time: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: '#18181B',
    marginTop: 4,
  },
  progressCard: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 16,
  },
  etaCard: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  etaLabel: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
    marginBottom: 4,
  },
  etaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  cancellationCard: {
    backgroundColor: '#FFE4E6',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F87171',
  },
  cancellationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 8,
  },
  cancellationReason: {
    fontSize: 14,
    color: '#991B1B',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#71717A',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18181B',
  },
  itemUnitPrice: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  infoLabel: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    color: '#18181B',
    lineHeight: 20,
  },
  pointsCard: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#71717A',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181B',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181B',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#18181B',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
  },
});
