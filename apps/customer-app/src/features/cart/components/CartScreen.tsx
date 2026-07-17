import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useCartStore } from '../../../store/useCartStore';
import { styled } from 'nativewind';

const StyledView = styled(View);

export const CartScreen = () => {
  const navigation = useNavigation<any>();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    fulfillmentMethod, 
    setFulfillmentMethod 
  } = useCartStore();
  
  const total = getTotal();
  const DELIVERY_FEE = 5.00;
  const currentDeliveryFee = fulfillmentMethod === 'delivery' ? DELIVERY_FEE : 0;
  const finalTotal = total + currentDeliveryFee;

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-zinc-50 items-center justify-center p-6">
        <Typography variant="h2" className="text-center mb-2">Your Cart is Empty</Typography>
        <Typography variant="body" className="text-center text-zinc-500 mb-6">
          Looks like you haven't added any Thai delicacies yet.
        </Typography>
          <Button title="Browse Menu" onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })} className="w-full" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50">
      <ScrollView className="px-4 pt-6 flex-1">
        <Typography variant="h1" className="font-poppins mb-6">Your Order</Typography>

        {/* Fulfillment Selection */}
        <View className="p-4 bg-white border border-zinc-200 rounded-2xl mb-6">
          <Typography variant="h3" className="mb-4">Delivery or Pickup?</Typography>
          <View className="flex-row bg-zinc-100 p-1 rounded-xl w-full">
            <TouchableOpacity 
              onPress={() => setFulfillmentMethod('delivery')}
              className={`flex-1 py-3 rounded-lg items-center justify-center ${fulfillmentMethod === 'delivery' ? 'bg-brand-primary' : 'bg-transparent'}`}
            >
              <Text className={`font-semibold ${fulfillmentMethod === 'delivery' ? 'text-white' : 'text-zinc-600'}`}>
                Delivery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFulfillmentMethod('pickup')}
              className={`flex-1 py-3 rounded-lg items-center justify-center ${fulfillmentMethod === 'pickup' ? 'bg-brand-primary' : 'bg-transparent'}`}
            >
              <Text className={`font-semibold ${fulfillmentMethod === 'pickup' ? 'text-white' : 'text-zinc-600'}`}>
                Pickup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {items.map((item) => (
          <View key={item.id} className="p-4 bg-white border border-zinc-200 rounded-xl mb-4 flex-row justify-between items-center">
            <View className="flex-1">
              <Typography variant="h3">{item.name}</Typography>
              <Typography variant="caption">${item.price.toFixed(2)} each</Typography>
            </View>
            
            <View className="flex-row items-center bg-zinc-100 rounded-lg p-1">
              <Button title="-" onPress={() => updateQuantity(item.id, -1)} className="px-2 py-1 w-8 h-8 rounded-md" />
              <Text className="px-3 font-bold">{item.quantity}</Text>
              <Button title="+" onPress={() => updateQuantity(item.id, 1)} className="px-2 py-1 w-8 h-8 rounded-md" />
            </View>
            
            <TouchableOpacity onPress={() => removeItem(item.id)} className="ml-4">
              <Text className="text-rose-500 font-medium">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View className="p-6 bg-white border-t border-zinc-200 rounded-t-3xl shadow-lg">
        <View className="flex-row justify-between mb-2">
          <Typography variant="body">Subtotal</Typography>
          <Typography variant="body">${total.toFixed(2)}</Typography>
        </View>
        <View className="flex-row justify-between mb-4">
          <Typography variant="body">{fulfillmentMethod === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}</Typography>
          <Typography variant="body">${currentDeliveryFee.toFixed(2)}</Typography>
        </View>
        <View className="flex-row justify-between mb-6">
          <Typography variant="h2">Total</Typography>
          <Typography variant="h2" className="text-brand-primary">${finalTotal.toFixed(2)}</Typography>
        </View>
        <Button title="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} className="py-4 text-lg" />
      </View>
    </View>
  );
};
