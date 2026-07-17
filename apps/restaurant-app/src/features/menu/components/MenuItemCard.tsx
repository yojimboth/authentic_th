import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MenuItem } from '../types';
import { formatCurrency } from '../../../utils/formatCurrency';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: () => void;
  onToggle?: () => void;
  showActions?: boolean;
}

export const MenuItemCard = ({ item, onEdit, onToggle, showActions = true }: MenuItemCardProps) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-zinc-200">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-base font-semibold text-zinc-900 flex-1" numberOfLines={1}>
          {item.name}
        </Text>
        <View
          className={`px-2 py-0.5 rounded-full ${
            item.isAvailable ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              item.isAvailable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 mb-3">
        <Text className="text-sm font-semibold text-zinc-900">{formatCurrency(item.price)}</Text>
        {item.preparationTime && (
          <Text className="text-xs text-zinc-400">• {item.preparationTime} min prep</Text>
        )}
      </View>

      {showActions && (
        <View className="flex-row gap-2">
          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              className="flex-1 border border-zinc-300 py-2 rounded-lg items-center"
              activeOpacity={0.8}
            >
              <Text className="text-zinc-600 text-sm font-medium">Edit</Text>
            </TouchableOpacity>
          )}
          {onToggle && (
            <TouchableOpacity
              onPress={onToggle}
              className={`flex-1 py-2 rounded-lg items-center ${
                item.isAvailable ? 'bg-red-50' : 'bg-green-50'
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-medium ${
                  item.isAvailable ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {item.isAvailable ? 'Make Unavailable' : 'Make Available'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};