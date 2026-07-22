import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardProps {
  title: string;
  value: string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export const SummaryCard = ({ title, value, trend, trendDirection = 'neutral' }: SummaryCardProps) => {
  const trendColor = trendDirection === 'up' ? '#10B981' : trendDirection === 'down' ? '#EF4444' : '#9CA3AF';
  const trendIcon = trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {trend !== undefined && trendDirection !== 'neutral' && (
        <Text style={[styles.trend, { color: trendColor }]}>
          {trendIcon} {trend}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  trend: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
});