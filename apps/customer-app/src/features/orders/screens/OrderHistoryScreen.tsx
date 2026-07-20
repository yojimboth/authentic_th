import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { useOrders } from '../hooks/useOrders';
import { Order, OrderStatus } from '../types';
import { currentConfig } from '../../../config/whiteLabelConfig';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Preparing': return { bg: '#FEF3C7', text: '#92400E', borderColor: '#FCD34D' };
      case 'Out for Delivery': return { bg: '#DBEAFE', text: '#1E40AF', borderColor: '#60A5FA' };
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

const OrderCard = ({ order, onPress }: { order: Order; onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      backgroundColor: '#FFFFFF',
      padding: 16,
      marginBottom: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E4E4E7',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <Text style={{ fontSize: 12, color: '#71717A', fontWeight: '500' }}>
        #{order.id.slice(-8)}
      </Text>
      <StatusBadge status={order.status} />
    </View>
    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#18181B', marginBottom: 4 }}>
          ${order.total.toFixed(2)}
        </Text>
        <Text style={{ fontSize: 12, color: '#71717A' }}>
          {new Date(order.date).toLocaleDateString()} • {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        {order.pointsEarned !== undefined && order.pointsEarned > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#D97706' }}>
              ★ {order.pointsEarned} pts
            </Text>
          </View>
        )}
        <Text style={{ 
          fontSize: 14, 
          fontWeight: '600', 
          color: currentConfig.theme.primaryColor 
        }}>
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentConfig.theme.primaryColor} />
      </View>
    );
  }

const activeOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Out for Delivery' || o.status === 'Ready');
const pastOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

  return (
    <KeyboardAvoidingView 
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Orders</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          {activeOrders.length > 0 ? (
            activeOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active orders at the moment</Text>
            </View>
          )}
        </View>

        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Past Orders</Text>
          {pastOrders.length > 0 ? (
            pastOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No past orders found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Poppins-Bold',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 16,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#71717A',
    fontStyle: 'italic',
  },
});
