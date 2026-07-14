import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Text, ActivityIndicator, Switch } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useCartStore } from '../../../store/useCartStore';
import { useProfile, UserProfile } from '../../profile/hooks/useProfile';
import apiClient from 'api-client';

interface CheckoutScreenProps {
  onPaymentSuccess: () => void;
}

type FulfillmentMethod = 'delivery' | 'pickup';

export const CheckoutScreen = ({ onPaymentSuccess }: CheckoutScreenProps) => {
  // Store & Profile
  const { getTotal, clearCart } = useCartStore();
  const { state: profileState } = useProfile();
  const userProfile = profileState.data;

  // State
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>('delivery');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Constants
  const DELIVERY_FEE = 5.00;
  const LOYALTY_CONVERSION_RATE = 5.00 / 100; // 100 points = $5.00

  // Calculations
  const subtotal = getTotal();
  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0;
  
  const maxLoyaltyDiscount = userProfile 
    ? userProfile.loyaltyPoints * LOYALTY_CONVERSION_RATE 
    : 0;
  
  // Discount cannot exceed (subtotal + deliveryFee)
  const loyaltyDiscount = useLoyaltyPoints 
    ? Math.min(maxLoyaltyDiscount, subtotal + deliveryFee) 
    : 0;

  const total = (subtotal + deliveryFee) - loyaltyDiscount;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Step A: Get Stripe client_secret
      const paymentResponse = await apiClient.post('/payments/stripe', {
        amount: Math.round(total * 100), // Cents for Stripe
        currency: 'aud',
      });

      const { client_secret } = paymentResponse.data;
      
      if (!client_secret) {
        throw new Error("Payment secret not received");
      }

      // Step B: Simulate Stripe Confirmation
      // In a real app, we'd use @stripe/stripe-react-native here
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Step C: Finalize order on backend
      await apiClient.post('/orders/confirm', {
        amount: total,
        fulfillmentMethod: fulfillment,
        usedLoyaltyPoints: useLoyaltyPoints,
      });

      // Step D: Clear Cart
      clearCart();

      // Step E: Final Success
      Alert.alert(
        "Order Placed!",
        "Your delicious meal is on its way.",
        [{ text: "Awesome", onPress: () => onPaymentSuccess() }]
      );

    } catch (error: any) {
      Alert.alert(
        "Payment Failed", 
        error.message || "Something went wrong while processing your payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (profileState.status === 'loading') {
    return (
      <View className="flex-1 bg-zinc-50 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Typography variant="body" className="mt-4 text-zinc-500">Loading profile...</Typography>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-zinc-50">
      <ScrollView className="px-6 pt-6 flex-1">
        <Typography variant="h1" className="font-poppins mb-6">Checkout</Typography>
        
        {/* Fulfillment Section */}
        <View className="p-4 bg-white border border-zinc-200 rounded-2xl mb-6">
          <Typography variant="h3" className="mb-4">Fulfillment Method</Typography>
          <View className="flex-row bg-zinc-100 p-1 rounded-xl">
            <Button 
              title="Delivery" 
              variant={fulfillment === 'delivery' ? 'primary' : 'ghost'} 
              className={`flex-1 py-2 rounded-lg ${fulfillment === 'delivery' ? 'bg-brand-primary' : ''}`}
              onPress={() => setFulfillment('delivery')}
            />
            <Button 
              title="Pickup" 
              variant={fulfillment === 'pickup' ? 'primary' : 'ghost'} 
              className={`flex-1 py-2 rounded-lg ${fulfillment === 'pickup' ? 'bg-brand-primary' : ''}`}
              onPress={() => setFulfillment('pickup')}
            />
          </View>
        </View>

        {/* Address Section - Only shown for Delivery */}
        {fulfillment === 'delivery' && (
          <View className="p-4 bg-white border border-zinc-200 rounded-2xl mb-6">
            <Typography variant="h3" className="mb-3">Delivery Address</Typography>
            <View className="flex-row items-start">
              <Typography variant="body" className="text-zinc-600 flex-1">
                {userProfile?.primaryAddress || "No address set"}
              </Typography>
            </View>
            <Button 
              title="Change Address" 
              variant="ghost" 
              className="mt-4 py-1 text-brand-primary" 
              onPress={() => {}} 
            />
          </View>
        )}

        {/* Loyalty Points Section */}
        <View className="p-4 bg-white border border-zinc-200 rounded-2xl mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Typography variant="h3">Loyalty Points</Typography>
            <View className="flex-row items-center bg-brand-primary/10 px-3 py-1 rounded-full">
              <Typography variant="body" className="text-brand-primary font-bold">
                {userProfile?.loyaltyPoints || 0} pts
              </Typography>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between p-3 bg-zinc-50 rounded-xl">
            <View>
              <Typography variant="body" className="font-bold">Redeem Points</Typography>
              <Typography variant="body" className="text-xs text-zinc-500">
                Save up to ${maxLoyaltyDiscount.toFixed(2)} on this order
              </Typography>
            </View>
            <Switch 
              value={useLoyaltyPoints} 
              onValueChange={setUseLoyaltyPoints}
              trackColor={{ false: '#D4D4D8', true: '#4F46E5' }}
            />
          </View>
        </View>

        {/* Order Summary Breakdown */}
        <View className="p-4 bg-white border border-zinc-200 rounded-2xl mb-8">
          <Typography variant="h3" className="mb-4">Order Summary</Typography>
          
          <View className="flex-row justify-between mb-3">
            <Typography variant="body" className="text-zinc-500">Items Subtotal</Typography>
            <Typography variant="body" className="font-medium">${subtotal.toFixed(2)}</Typography>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Typography variant="body" className="text-zinc-500">
              {fulfillment === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
            </Typography>
            <Typography variant="body" className="font-medium">${deliveryFee.toFixed(2)}</Typography>
          </View>

          {useLoyaltyPoints && (
            <View className="flex-row justify-between mb-3 text-green-600">
              <Typography variant="body" className="text-green-600">Loyalty Discount</Typography>
              <Typography variant="body" className="font-medium text-green-600">
                -${loyaltyDiscount.toFixed(2)}
              </Typography>
            </View>
          )}

          <View className="flex-row justify-between pt-4 border-t border-zinc-200 mt-3">
            <Typography variant="h2">Total Amount</Typography>
            <Typography variant="h2" className="text-brand-primary font-bold">${total.toFixed(2)}</Typography>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-zinc-200">
        <Button 
          title={isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`} 
          onPress={handlePayment} 
          className="py-4 text-lg" 
          disabled={isProcessing || subtotal === 0}
        />
      </View>
    </View>
  );
};
