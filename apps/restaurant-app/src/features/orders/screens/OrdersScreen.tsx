import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { Order } from '../types';
import { OrderCard } from '../components/OrderCard';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../../../utils/formatCurrency';

type OrdersScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainTabs'>;
};

type FilterType = 'all' | 'active' | 'completed';

export const OrdersScreen = ({ navigation }: OrdersScreenProps) => {
  const { orders, isLoading, fetchOrders, acceptOrder, prepareOrder, completeOrder } = useOrders();
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(order.status);
    }
    if (filter === 'completed') {
      return ['Completed', 'Cancelled'].includes(order.status);
    }
    return true;
  });

  const activeOrders = filteredOrders.filter((o) =>
    ['Pending', 'Accepted', 'Preparing', 'Ready'].includes(o.status)
  );

  const recentOrders = filteredOrders.filter((o) =>
    ['Completed', 'Cancelled'].includes(o.status)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: onConfirm },
    ]);
  };

  const handleAccept = (orderId: string) => {
    showConfirmation('Accept Order', 'Are you sure you want to accept this order?', () => {
      acceptOrder(orderId);
    });
  };

  const handlePrepare = (orderId: string) => {
    showConfirmation('Start Preparing', 'Mark this order as preparing?', () => {
      prepareOrder(orderId);
    });
  };

  const handleComplete = (orderId: string) => {
    showConfirmation('Complete Order', 'Mark this order as completed?', () => {
      completeOrder(orderId);
    });
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>
        {title} ({count})
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onPress={() => handleOrderPress(item)}
      onAccept={() => handleAccept(item.id)}
      onPrepare={() => handlePrepare(item.id)}
      onComplete={() => handleComplete(item.id)}
      showActions={['Pending', 'Accepted', 'Preparing', 'Ready'].includes(item.status)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No orders found</Text>
      <Text style={styles.emptySubtext}>New orders will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>My Orders</Text>
        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {/* Active Orders Section */}
              {activeOrders.length > 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderTitle}>
                      Active Orders ({activeOrders.length})
                    </Text>
                  </View>
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPress={() => handleOrderPress(order)}
                      onAccept={() => handleAccept(order.id)}
                      onPrepare={() => handlePrepare(order.id)}
                      onComplete={() => handleComplete(order.id)}
                      showActions={true}
                    />
                  ))}
                </View>
              )}

              {/* Recent Orders Section */}
              {recentOrders.length > 0 && (
                <View style={styles.recentSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderTitle}>
                      Recent Orders ({recentOrders.length})
                    </Text>
                  </View>
                  {recentOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPress={() => handleOrderPress(order)}
                      onAccept={() => handleAccept(order.id)}
                      onPrepare={() => handlePrepare(order.id)}
                      onComplete={() => handleComplete(order.id)}
                      showActions={false}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  footerSpacer: {
    height: 8,
  },
});