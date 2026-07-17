import React from 'react';
import { View, Text } from 'react-native';

interface SummaryCardProps {
  title: string;
  value: string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export const SummaryCard = ({ title, value, trend, trendDirection = 'neutral' }: SummaryCardProps) => {
  const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-zinc-400';
  const trendIcon = trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→';

  return (
    <View className="bg-white rounded-xl p-4 flex-1 min-w-[140px] border border-zinc-200">
      <Text className="text-xs font-medium text-zinc-500 mb-1">{title}</Text>
      <Text className="text-xl font-bold text-zinc-900 mb-1">{value}</Text>
      {trend !== undefined && trendDirection !== 'neutral' && (
        <Text className={`text-xs font-medium ${trendColor}`}>
          {trendIcon} {trend}%
        </Text>
      )}
    </View>
  );
};