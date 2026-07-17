import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SalesSummary, PopularItem } from '../types';
import { SummaryCard } from '../components/SummaryCard';
import { PopularItemRow } from '../components/PopularItemRow';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '../../../utils/formatCurrency';
import { mockRevenueChartData } from '../../../services/mockData';

export const AnalyticsScreen = () => {
  const { sales, popularItems, isLoading, refetch } = useAnalytics();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => setRefreshing(false), 500);
  };

  const maxChartValue = Math.max(...mockRevenueChartData.map((d) => d.value));

  return (
    <View className="flex-1 bg-zinc-50">
      <View className="bg-white px-4 pt-4 pb-3 border-b border-zinc-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-zinc-900">Analytics</Text>
          <View className="flex-row gap-2">
            {(['today', 'week', 'month'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full ${
                  period === p ? 'bg-brand-primary' : 'bg-zinc-100'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    period === p ? 'text-white' : 'text-zinc-600'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        {isLoading && !refreshing ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : sales ? (
          <>
            <View className="flex-row gap-3 mb-6">
              <SummaryCard
                title="Revenue"
                value={formatCurrency(sales.totalRevenue)}
                trend={sales.trend?.revenue}
                trendDirection={sales.trend?.revenue && sales.trend.revenue > 0 ? 'up' : sales.trend?.revenue && sales.trend.revenue < 0 ? 'down' : 'neutral'}
              />
              <SummaryCard
                title="Orders"
                value={sales.totalOrders.toString()}
                trend={sales.trend?.orders}
                trendDirection={sales.trend?.orders && sales.trend.orders > 0 ? 'up' : sales.trend?.orders && sales.trend.orders < 0 ? 'down' : 'neutral'}
              />
            </View>

            <View className="mb-6">
              <SummaryCard
                title="Average Order Value"
                value={formatCurrency(sales.averageOrderValue)}
                trend={sales.trend?.revenue ? Math.round(sales.trend.revenue * 0.5) : undefined}
                trendDirection={sales.trend?.revenue && sales.trend.revenue > 0 ? 'up' : sales.trend?.revenue && sales.trend.revenue < 0 ? 'down' : 'neutral'}
              />
            </View>

            <View className="bg-white rounded-xl p-4 mb-6 border border-zinc-200">
              <Text className="text-base font-semibold text-zinc-900 mb-4">Weekly Revenue</Text>
              <View className="flex-row items-end justify-between h-32 gap-2">
                {mockRevenueChartData.map((day, index) => {
                  const heightPercent = (day.value / maxChartValue) * 100;
                  return (
                    <View key={index} className="flex-1 items-center">
                      <View
                        className="w-full rounded-t bg-brand-primary"
                        style={{ height: heightPercent, minHeight: 8 }}
                      />
                      <Text className="text-xs text-zinc-400 mt-1">{day.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View className="bg-white rounded-xl p-4 mb-8 border border-zinc-200">
              <Text className="text-base font-semibold text-zinc-900 mb-3">Popular Items</Text>
              {popularItems.slice(0, 5).map((item, index) => (
                <PopularItemRow key={item.itemId} item={item} rank={index + 1} />
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};