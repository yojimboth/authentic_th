import React from 'react';
import { View, Image, ScrollView, SafeAreaView } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { FoodItem } from '../types';

interface FoodItemDetailScreenProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem, modifiers: any[]) => void;
  onBack: () => void;
}

export const FoodItemDetailScreen = ({ item, onAddToCart, onBack }: FoodItemDetailScreenProps) => {
  // Mock modifiers based on common Thai food patterns as defined in Program Specs
  const mockModifiers = [
    { id: 'mod-1', name: 'Extra Spicy', price: 0, type: 'choice' },
    { id: 'mod-2', name: 'Double Protein', price: 5.00, type: 'additive' },
    { id: 'mod-3', name: 'No Cilantro', price: 0, type: 'choice' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Hero Image */}
        <View className="relative">
          <Image 
            source={{ uri: item.imageUrl }} 
            className="w-full aspect-video"
            resizeMode="cover"
          />
          <TouchableOpacity 
            onPress={onBack}
            className="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow-sm"
          >
            <Text className="text-zinc-900 font-semibold">← Back</Text>
          </TouchableOpacity>
        </View>

        <View className="p-6">
          <View className="flex-row justify-between items-start mb-2">
            <Typography variant="h1" className="font-poppins flex-1">{item.name}</Typography>
            <Typography variant="h2" className="text-brand-primary">${item.price.toFixed(2)}</Typography>
          </View>
          
          <Typography variant="body" className="text-zinc-500 mb-6">
            {item.description}
          </Typography>

          {/* Spice Level Indicator */}
          <View className="mb-8 p-4 bg-zinc-50 rounded-xl">
            <Typography variant="h3" className="mb-3">Spice Level</Typography>
            <View className="flex-row items-center">
              {[...Array(5)].map((_, i) => (
                <View 
                  key={i} 
                  className={`w-4 h-4 rounded-full mx-1 ${i < item.spice ? 'bg-rose-500' : 'bg-zinc-200'}`} 
                />
              ))}
              <Typography variant="body" className="ml-3 text-zinc-600 font-medium">
                {item.spice === 0 ? 'Mild' : item.spice === 1 ? 'Gentle' : item.spice === 2 ? 'Medium' : item.spice === 3 ? 'Hot' : 'Thai Spicy'}
              </Typography>
            </View>
          </View>

          {/* Modifiers Section */}
          <View className="mb-8">
            <Typography variant="h3" className="mb-4">Customizations</Typography>
            {mockModifiers.map((mod) => (
              <View key={mod.id} className="flex-row items-center justify-between py-3 border-b border-zinc-100">
                <Typography variant="body">{mod.name}</Typography>
                <Text className={`font-medium ${mod.price > 0 ? 'text-brand-primary' : 'text-zinc-400'}`}>
                  {mod.price > 0 ? `+$${mod.price.toFixed(2)}` : 'Free'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="p-6 border-t border-zinc-100 bg-white">
        <Button 
          title={`Add to Order - $${item.price.toFixed(2)}`} 
          onPress={() => onAddToCart(item, [])} 
          className="py-4 text-lg"
        />
      </View>
    </SafeAreaView>
  );
};
