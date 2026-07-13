import React from 'react';
import { View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useCartStore } from '../../../store/useCartStore';
import apiClient from '../../../services/apiClient';

interface CheckoutScreenProps {
  onPaymentSuccess: () => void;
}

export const CheckoutScreen = ({ onPaymentSuccess }: CheckoutScreenProps) => {
  const { getTotal, clearCart } = useCartStore();
  const total = getTotal() + 5; // Including delivery fee

  const handlePayment = async () => {
    try {
      // 1. Call the Mock-Double endpoint to create Stripe PaymentIntent
      const response = await apiClient.post('/payments/stripe', {
        amount: total * 100, // Cents for Stripe
        currency: 'aud',
      });

      const { client_secret } = response.data;
      
      if (client_secret) {
        // 2. Simulate Stripe SDK Processing
        Alert.alert(
          "Stripe Payment", 
          `Processing payment of $${total.toFixed(2)}...`,
          [{ 
            text: "Confirm Payment", 
            onPress: () => {
              clearCart();
              onPaymentSuccess();
            } 
          }]
        );
      }
    } catch (error) {
      Alert.alert("Payment Error", "Failed to initialize payment. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <ScrollView className="px-6 pt-6 flex-1">
        <Typography variant="h1" className="font-poppins mb-6">Checkout</Typography>
        
        {/* Delivery Address Section */}
        <View className="p-4 bg-white border border-zinc-200 rounded-xl mb-6">
          <Typography variant="h3" className="mb-3">Delivery Address</Typography>
          <Typography variant="body" className="text-zinc-600">
            12 George St, Sydney NSW 2000
          </Typography>
          <Button title="Change Address" variant="ghost" className="mt-4 py-1" onPress={() => {}} />
        </View>

        {/* Payment Method Section */}
        <View className="p-4 bg-white border border-zinc-200 rounded-xl mb-6">
          <Typography variant="h3" className="mb-3">Payment Method</Typography>
          <View className="flex-row items-center p-3 bg-zinc-50 rounded-lg border-2 border-brand-primary">
            <View className="w-10 h-6 bg-indigo-600 rounded mr-3" />
            <Typography variant="body" className="flex-1">Visa ending in 4242</Typography>
            <Text className="text-brand-primary font-bold">Active</Text>
          </View>
        </View>

        {/* Order Summary Breakdown */}
        <View className="p-4 bg-white border border-zinc-200 rounded-xl mb-8">
          <Typography variant="h3" className="mb-4">Order Summary</Typography>
          <View className="flex-row justify-between mb-2">
            <Typography variant="body">Items Subtotal</Typography>
            <Typography variant="body">${(total - 5).toFixed(2)}</Typography>
          </View>
          <View className="flex-row justify-between mb-4">
            <Typography variant="body">Delivery Fee</Typography>
            <Typography variant="body">$5.00</Typography>
          </View>
          <View className="flex-row justify-between pt-4 border-t border-zinc-200">
            <Typography variant="h2">Total Amount</Typography>
            <Typography variant="h2" className="text-brand-primary">${total.toFixed(2)}</Typography>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-zinc-200">
        <Button 
          title="Pay Now" 
          onPress={handlePayment} 
          className="py-4 text-lg" 
        />
      </View>
    </SafeAreaView>
  );
};
