import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PopularItem } from '../types';
import { formatCurrency } from '../../../utils/formatCurrency';

interface PopularItemRowProps {
  item: PopularItem;
  rank: number;
}

export const PopularItemRow = ({ item, rank }: PopularItemRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.itemName}</Text>
      </View>
      <Text style={styles.quantitySold}>{item.quantitySold} sold</Text>
      <Text style={styles.revenue}>{formatCurrency(item.revenue)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  quantitySold: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginRight: 16,
  },
  revenue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
});