import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Text, ActivityIndicator, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useCartStore, cleanupCartData } from '../../../store/useCartStore';
import { useProfile, UserProfile } from '../../profile/hooks/useProfile';
import apiClient from 'api-client';
import { FoodItem } from '../../menu/types';

interface CheckoutScreenProps {
  onPaymentSuccess: () => void;
}

type FulfillmentMethod = 'delivery' | 'pickup';

export const CheckoutScreen = ({ onPaymentSuccess }: CheckoutScreenProps) => {
  type NavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  // Store & Profile
  const { getTotal, clearCart } = useCartStore();
  const { state: profileState } = useProfile();
  
  // Security: Properly narrow AsyncState type before accessing data
  const userProfile = profileState.status === 'success' ? profileState.data : null;

  // State
  const fulfillment = useCartStore((state) => state.fulfillmentMethod);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Constants
  const DELIVERY_FEE = 5.00;
  const LOYALTY_CONVERSION_RATE = 5.00 / 100; // 100 points = $5.00
  const POINTS_EARN_RATE = 1; // 1 point per $1 spent

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

  // Points calculations (only for registered membros)
  const pointsToEarn = userProfile ? Math.floor(total * POINTS_EARN_RATE) : 0;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Security: Get cart items for payment request
      const cartItems = useCartStore.getState().items;
      
      // Transform cart items for API request (security: only send IDs and quantities)
      // Note: CartItem extends FoodItem which has 'id', 'quantity', and 'selectedModifiers'
      const itemsForPayment: { itemId: string; quantity: number; selectedModifiers: string[] }[] = cartItems.map((item: any) => ({
        itemId: item.id,
        quantity: item.quantity,
        selectedModifiers: item.selectedModifiers,
      }));
      
      // Step A: Get Stripe client_secret
      // Security: Send cart items, NOT client-calculated total
      // Backend must calculate final amount based on cart items and tenant pricing
      const paymentResponse = await apiClient.post('/payments/stripe', {
        cartItems: itemsForPayment,
        fulfillmentMethod: fulfillment,
        useLoyaltyPoints: useLoyaltyPoints,
        currency: 'aud',
        // NOTE: 'amount' is NOT sent from client - backend calculates it
      });

      const { client_secret, calculatedAmount } = paymentResponse.data;
      
      if (!client_secret) {
        throw new Error("Payment secret not received");
      }

      // Security: Verify calculated amount matches our display (client-side check only)
      // The backend is the source of truth for pricing
      const backendTotalCents = Math.round(calculatedAmount * 100);
      const clientTotalCents = Math.round(total * 100);

      // Allow small floating point differences (1 cent tolerance)
      if (Math.abs(backendTotalCents - clientTotalCents) > 1) {
        console.error(`Price mismatch: backend=${calculatedAmount}, client=${total}`);
        throw new Error("Payment amount mismatch. Please try again.");
      }

      // Additional check: ensure amount is positive and reasonable
      if (calculatedAmount <= 0 || calculatedAmount > 10000) {
        console.error(`Suspicious amount: ${calculatedAmount}`);
        throw new Error("Invalid payment amount. Please try again.");
      }
      
      // Step B: Simulate Stripe Confirmation
      // In a real app, we'd use @stripe/stripe-react-native here
      await new Promise(resolve => setTimeout(resolve, 1500)); 

       // Step C: Finalize order on backend
       // Security: Send cart items and fulfillment details, NOT calculated amount
       await apiClient.post('/orders/confirm', {
         cartItems: itemsForPayment,
         fulfillmentMethod: fulfillment,
         useLoyaltyPoints: useLoyaltyPoints,
       });

      // Step D: Clear Cart
      clearCart();

      // SECURITY: Clean up stale cart data per data retention policy
      await cleanupCartData();

      // Step E: Final Success
      Alert.alert(
        "Order Placed!",
        "Your delicious meal is on its way.",
        [{ text: "Awesome", onPress: () => onPaymentSuccess() }]
      );

    } catch (error: any) {
      // Security: Don't expose internal error details to users
      console.error('Payment processing error:', error);
      Alert.alert(
        "Payment Failed", 
        "Something went wrong while processing your payment. Please try again or contact support."
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
        <View className="flex-row items-center mb-6">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="p-2 -ml-2 mr-2"
          >
            <Text className="text-brand-primary font-bold">← Back to Cart</Text>
          </TouchableOpacity>
          <Typography variant="h1" className="font-poppins flex-1 text-center">Checkout</Typography>
          <View className="w-10" />
        </View>
        
        <View className="p-4 bg-white border border-zinc-200 rounded-2xl mb-6">
          <View className="flex-row justify-between items-center">
            <Typography variant="h3">Fulfillment Method</Typography>
            <Typography variant="body" className={`font-bold ${fulfillment === 'delivery' ? 'text-brand-primary' : 'text-zinc-600'}`}>
              {fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}
            </Typography>
          </View>
          <Typography variant="caption" className="text-zinc-500 mt-1">
            Changed in your cart
          </Typography>
        </View>

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
            <View className="flex-row justify-between mb-3">
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
          {userProfile && (
            <View className="flex-row justify-between items-center mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <Text className="text-yellow-700 text-sm font-medium">Points you'll earn</Text>
              <Text className="text-yellow-700 font-bold">{pointsToEarn} pts</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View className="p-6 bg-white border-t border-zinc-200">
        <Button 
          title={isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`} 
          onPress={handlePayment} 
          className="py-4 text-lg" 
          loading={isProcessing}
        />
      </View>
    </View>
  );

};
