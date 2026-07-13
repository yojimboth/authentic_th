import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { FoodItemCard } from './FoodItemCard';
import { useMenu } from '../hooks/useMenu';

export const MenuScreen = () => {
  const { state } = useMenu();

  if (state.status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-zinc-50 items-center justify-center">
        <Typography variant="body">Loading Delicious Thai Food...</Typography>
      </SafeAreaView>
    );
  }

  if (state.status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-zinc-50 items-center justify-center p-4">
        <Typography variant="h3" className="text-rose-500">Oops!</Typography>
        <Typography variant="body" className="text-center">{state.error}</Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <ScrollView className="px-4 pt-6">
        <Typography variant="h1" className="font-poppins mb-2">Siam Authentic</Typography>
        <Typography variant="body" className="text-zinc-500 mb-6">Fresh, appetising, energetic.</Typography>

        {state.data?.map((cat) => (
          <View key={cat.category} className="mb-8">
            <Typography variant="h2" className="font-poppins mb-4">{cat.category}</Typography>
            <View className="flex-row flex-wrap justify-between">
              {cat.items.map((item) => (
                <View key={item.id} className="w-[48%]">
                  <FoodItemCard 
                    item={item} 
                    onAddToCart={(item) => console.log('Added to cart:', item.name)} 
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
