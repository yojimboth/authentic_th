import { currentConfig } from '../../../config/whiteLabelConfig';
import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { StoreLogo } from '../../../components/common/StoreLogo';
import { FoodItemCard } from '../components/FoodItemCard';
import { useMenu } from '../hooks/useMenu';
import { useCartStore } from '../../../store/useCartStore';

export const MenuScreen = () => {
  const { state } = useMenu();
  const addItem = useCartStore((state) => state.addItem);
  const scrollRef = useRef<ScrollView>(null);
  
  // Store the Y-offsets of each category header
  const categoryOffsets = useRef<Map<string, number>>(new Map());

  if (state.status === 'loading') {
    return (
      <View className="flex-1 bg-zinc-50 items-center justify-center">
        <Typography variant="body">Loading Delicious Thai Food...</Typography>
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View className="flex-1 bg-zinc-50 items-center justify-center p-4">
        <Typography variant="h3" className="text-rose-500">Oops!</Typography>
        <Typography variant="body" className="text-center">{state.error}</Typography>
      </View>
    );
  }

  // Type guard for success state
  if (state.status !== 'success') {
    return null;
  }
  
  const menuData = state.data;

  const handleAddToCart = (item: any) => {
    addItem(item, []);
    Alert.alert(
      "Added to Cart",
      `${item.name} has been added to your order.`,
      [{ text: "OK" }]
    );
  };

  const scrollToCategory = (category: string) => {
    const yOffset = categoryOffsets.current.get(category);
    if (yOffset !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  return (
    <View className="flex-1 bg-zinc-50">
      {/* Sticky Header */}
      <View className="bg-zinc-50 px-4 pt-6 pb-4 border-b border-zinc-200 shadow-sm z-10">
        <View className="flex-row items-center mb-6">
          <StoreLogo logoSource={currentConfig.logoSource} size={48} style={{ marginRight: 24 }} />
          <View className="flex-1">
            <Typography variant="h1" className="font-poppins mb-1">{currentConfig.restaurantName}</Typography>
            <Typography variant="body" className="text-zinc-500">Fresh, appetising, energetic.</Typography>
          </View>
        </View>

        {/* Category Quick-Nav */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="flex-row"
        >
          {menuData.map((cat) => (
            <TouchableOpacity 
              key={cat.category} 
              onPress={() => scrollToCategory(cat.category)}
              className="mr-2 px-4 py-2 bg-white border border-zinc-200 rounded-full shadow-sm"
            >
              <Typography variant="caption" className="font-medium text-zinc-800">
                {cat.category}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        ref={scrollRef}
        className="px-4"
        contentContainerStyle={{ paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {menuData.map((cat) => (
          <View 
            key={cat.category} 
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              categoryOffsets.current.set(cat.category, layout.y);
            }}
            className="mb-8"
          >
            <Typography variant="h2" className="font-poppins mb-4 px-1">{cat.category}</Typography>
            <View className="flex-col">
              {cat.items.map((item) => (
                <View key={item.id} className="w-full mb-4">
                  <FoodItemCard 
                    item={item} 
                    onAddToCart={handleAddToCart} 
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
        
        <View className="h-20" />
      </ScrollView>

    </View>
  );
};
