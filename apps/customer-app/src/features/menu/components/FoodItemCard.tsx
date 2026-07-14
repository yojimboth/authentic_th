import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { FoodItem } from '../types';
import { Button } from '../../../components/common/Button';

interface FoodItemCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

export const FoodItemCard = ({ item, onAddToCart }: FoodItemCardProps) => {
  return (
    <View className="flex-row p-3 bg-white border border-zinc-200 rounded-xl shadow-sm mb-4">
      <Image 
        source={{ uri: item.imageUrl }} 
        style={{ width: 100, height: 100, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-between py-1">
        <View>
          <Typography variant="h3" className="pr-2">{item.name}</Typography>
          <Text className="font-bold text-brand-primary text-base">${item.price.toFixed(2)}</Text>
          <Typography variant="caption" className="mt-1 line-clamp-2 text-zinc-500">
            {item.description}
          </Typography>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Text className="text-[10px] text-zinc-400 mr-1 uppercase font-bold">Spice</Text>
            <View className="flex-row">
              {[...Array(5)].map((_, i) => (
                <View 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i < item.spice ? 'bg-rose-500' : 'bg-zinc-200'}`} 
                />
              ))}
            </View>
          </View>
          <Button 
            title="Add" 
            onPress={() => onAddToCart(item)} 
            className="px-3 py-1 text-xs h-8 rounded-md" 
          />
        </View>
      </View>
    </View>
  );
};

