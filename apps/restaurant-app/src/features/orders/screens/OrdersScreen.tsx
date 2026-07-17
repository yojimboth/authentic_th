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
    <View className="px-4 pt-4 pb-2">
      <Text className="text-base font-semibold text-zinc-900">
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
    <View className="items-center justify-center py-12 px-4">
      <Text className="text-zinc-400 text-base">No orders found</Text>
      <Text className="text-zinc-400 text-sm mt-1">New orders will appear here</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-zinc-50">
      <View className="bg-white px-4 pt-4 pb-3 border-b border-zinc-200">
        <Text className="text-2xl font-bold text-zinc-900">My Orders</Text>
        <View className="flex-row mt-3 gap-2">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full ${
                filter === f ? 'bg-brand-primary' : 'bg-zinc-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === f ? 'text-white' : 'text-zinc-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
          }
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={
            filteredOrders.length > 0 ? (
              <>
                {activeOrders.length > 0 && renderSectionHeader('Active Orders', activeOrders.length)}
                {recentOrders.length > 0 && renderSectionHeader('Recent Orders', recentOrders.length)}
              </>
            ) : undefined
          }
          ListFooterComponent={() => {
            if (activeOrders.length > 0) {
              return recentOrders.length > 0 ? (
                <View className="h-2" />
              ) : undefined;
            }
            return undefined;
          }}
        />
      )}
    </View>
  );
};