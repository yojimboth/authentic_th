import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Analytics</Text>
          <View style={styles.periodContainer}>
            {(['today', 'week', 'month'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[
                  styles.periodButton,
                  period === p && styles.periodButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    period === p && styles.periodTextActive,
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : sales ? (
          <>
            <View style={styles.summaryRow}>
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

            <View style={styles.summaryCardContainer}>
              <SummaryCard
                title="Average Order Value"
                value={formatCurrency(sales.averageOrderValue)}
                trend={sales.trend?.revenue ? Math.round(sales.trend.revenue * 0.5) : undefined}
                trendDirection={sales.trend?.revenue && sales.trend.revenue > 0 ? 'up' : sales.trend?.revenue && sales.trend.revenue < 0 ? 'down' : 'neutral'}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Weekly Revenue</Text>
              <View style={styles.chartContainer}>
                {mockRevenueChartData.map((day, index) => {
                  const heightPercent = (day.value / maxChartValue) * 100;
                  return (
                    <View key={index} style={styles.chartBarContainer}>
                      <View
                        style={[
                          styles.chartBar,
                          { height: heightPercent, minHeight: 8 },
                        ]}
                      />
                      <Text style={styles.chartLabel}>{day.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.popularItemsCard}>
              <Text style={styles.popularItemsTitle}>Popular Items</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  periodButtonActive: {
    backgroundColor: '#4F46E5',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  summaryCardContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 128,
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
    marginTop: 6,
  },
  popularItemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  popularItemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
});