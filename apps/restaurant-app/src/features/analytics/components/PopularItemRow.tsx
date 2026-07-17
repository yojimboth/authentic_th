import React from 'react';
import { View, Text } from 'react-native';
import { PopularItem } from '../types';
import { formatCurrency } from '../../../utils/formatCurrency';

interface PopularItemRowProps {
  item: PopularItem;
  rank: number;
}

export const PopularItemRow = ({ item, rank }: PopularItemRowProps) => {
  return (
    <View className="flex-row items-center py-3 border-b border-zinc-100 last:border-b-0">
      <View className="w-7 h-7 rounded-full bg-brand-primary items-center justify-center mr-3">
        <Text className="text-white text-xs font-bold">{rank}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-zinc-900">{item.itemName}</Text>
      </View>
      <Text className="text-sm text-zinc-500 mr-4">{item.quantitySold} sold</Text>
      <Text className="text-sm font-semibold text-zinc-900">{formatCurrency(item.revenue)}</Text>
    </View>
  );
};