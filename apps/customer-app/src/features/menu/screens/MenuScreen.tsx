import { currentConfig } from '../../../config/whiteLabelConfig';
import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
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
      <View style={{ backgroundColor: '#FAFAFA', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3, zIndex: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <StoreLogo logoSource={currentConfig.logoSource} size={56} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: '600', color: '#18181B', fontFamily: 'Poppins-Semibold', marginBottom: 4 }}>
              {currentConfig.restaurantName}
            </Text>
            <Text style={{ fontSize: 16, color: '#71717A' }}>
              {currentConfig.slogan}
            </Text>
          </View>
        </View>

        {/* Category Quick-Nav - Horizontal scrollable pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ flexDirection: 'row', paddingHorizontal: 0 }}
        >
          {menuData.map((cat) => (
            <TouchableOpacity 
              key={cat.category} 
              onPress={() => scrollToCategory(cat.category)}
              style={{ 
                marginRight: 8, 
                paddingHorizontal: 16, 
                paddingVertical: 10, 
                backgroundColor: '#FFFFFF', 
                borderWidth: 1, 
                borderColor: '#E4E4E7', 
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#3F3F46' }}>
                {cat.category}
              </Text>
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
            {/* Category Header - Semibold, slightly larger than item names */}
            <Text style={{ fontSize: 22, fontWeight: '600', color: '#18181B', marginBottom: 24, paddingLeft: 4, fontFamily: 'Poppins-Semibold' }}>
              {cat.category}
            </Text>
            <View className="flex-col">
              {cat.items.map((item) => (
                <View key={item.id} className="w-full mb-4">
                  <FoodItemCard 
                    item={item} 
                    onAddToCart={handleAddToCart}
                    category={cat.category}
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
