import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { FoodItem } from '../../features/menu/types';
import { Button } from './Button';

interface FoodItemCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

export const FoodItemCard = ({ item, onAddToCart }: FoodItemCardProps) => {
  return (
    <View className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm mb-4">
      <Image 
        source={{ uri: item.imageUrl }} 
        className="w-full aspect-square rounded-lg mb-3"
        resizeMode="cover"
      />
      <View className="flex-row justify-between items-start mb-1">
        <Typography variant="h3" className="flex-1">{item.name}</Typography>
        <Text className="font-bold text-brand-primary ml-2">${item.price.toFixed(2)}</Text>
      </View>
      <Typography variant="caption" className="mb-3 line-clamp-2">
        {item.description}
      </Typography>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-xs text-zinc-400 mr-1">Spice:</Text>
          <View className="flex-row">
            {[...Array(5)].map((_, i) => (
              <View 
                key={i} 
                className={`w-2 h-2 rounded-full mx-0.5 ${i < item.spice ? 'bg-rose-500' : 'bg-zinc-200'}`} 
              />
            ))}
          </View>
        </View>
        <Button 
          title="Add" 
          onPress={() => onAddToCart(item)} 
          className="px-3 py-1 text-xs" 
        />
      </View>
    </View>
  );
};
