import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Text, ActivityIndicator, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useCartStore, cleanupCartData } from '../../../store/useCartStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useProfile, UserProfile } from '../../profile/hooks/useProfile';
import apiClient from '../../../services/api-client';
import { FoodItem } from '../../menu/types';
import { currentConfig } from '../../../config/whiteLabelConfig';

interface CheckoutScreenProps {
  onPaymentSuccess: () => void;
}

type FulfillmentMethod = 'delivery' | 'pickup';

export const CheckoutScreen = ({ onPaymentSuccess }: CheckoutScreenProps) => {
  type NavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  // Store & Profile
  const { getTotal, clearCart } = useCartStore();
  const { isMember, isGuest, setGuest } = useAuthStore();
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
      // Interception: Require guest or member status before proceeding to payment.
      // If user is fully unauthenticated (no guest session), send them to AuthChoice.
      if (!isMember() && !isGuest()) {
        navigation.navigate('AuthChoice', { onReturnToCheckout: () => navigation.goBack() });
        setIsProcessing(false);
        return;
      }

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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: currentConfig.theme.primaryColor }]}>← Back to Cart</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Checkout</Text>
        </View>
        
        {/* Fulfillment Method Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Typography variant="h3" style={styles.cardTitle}>Fulfillment Method</Typography>
            <Text style={[styles.cardValue, { color: fulfillment === 'delivery' ? currentConfig.theme.primaryColor : '#71717A' }, { fontWeight: '600' }]}>
              {fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}
            </Text>
          </View>
          <Text style={styles.cardSubtitle}>Changed in your cart</Text>
        </View>

        {fulfillment === 'delivery' && (
          <View style={styles.card}>
            <Typography variant="h3" style={[styles.cardTitle, { marginBottom: 12 }]}>Delivery Address</Typography>
            <Text style={styles.addressText}>
              {userProfile?.primaryAddress || "No address set"}
            </Text>
            <TouchableOpacity style={styles.changeAddressButton}>
              <Text style={[styles.changeAddressText, { color: currentConfig.theme.primaryColor }]}>
                Change Address
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loyalty Points Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Typography variant="h3" style={styles.cardTitle}>Loyalty Points</Typography>
            <View style={[styles.pointsBadge, { backgroundColor: `${currentConfig.theme.primaryColor}10` }]}>
              <Text style={[styles.pointsBadgeText, { color: currentConfig.theme.primaryColor }, { fontWeight: '700' }]}>
                {userProfile?.loyaltyPoints || 0} pts
              </Text>
            </View>
          </View>
          <View style={styles.redemptionContainer}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#18181B', marginBottom: 4 }}>Redeem Points</Text>
              <Text style={{ fontSize: 12, color: '#71717A' }}>
                Save up to ${maxLoyaltyDiscount.toFixed(2)} on this order
              </Text>
            </View>
            <Switch 
              value={useLoyaltyPoints} 
              onValueChange={setUseLoyaltyPoints}
              trackColor={{ false: '#D4D4D8', true: currentConfig.theme.primaryColor }}
              thumbColor={useLoyaltyPoints ? currentConfig.theme.primaryColor : '#F4F4F5'}
            />
          </View>
        </View>

        {/* Order Summary Card */}
        <View style={[styles.card, { marginBottom: 100 }]}>
          <Typography variant="h3" style={[styles.cardTitle, { marginBottom: 16 }]}>Order Summary</Typography>
          
          <View style={styles.summaryRow}>
            <Text style={{ fontSize: 14, color: '#71717A' }}>Items Subtotal</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#18181B' }}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={{ fontSize: 14, color: '#71717A' }}>
              {fulfillment === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#18181B' }}>${deliveryFee.toFixed(2)}</Text>
          </View>
          
          {useLoyaltyPoints && (
            <View style={styles.summaryRow}>
              <Text style={{ fontSize: 14, color: '#10B981' }}>Loyalty Discount</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#10B981' }}>
                -${loyaltyDiscount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#18181B' }}>Total Amount</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: currentConfig.theme.primaryColor }}>${total.toFixed(2)}</Text>
          </View>
          
          {userProfile && (
            <View style={[styles.earningsBadge, { backgroundColor: '#FEF9C3', borderColor: '#FDE68A' }]}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#92400E' }}>Points you'll earn</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#92400E' }}>{pointsToEarn} pts</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Sticky Bottom Payment Button */}
      <View style={styles.paymentContainer}>
        <TouchableOpacity 
          style={[styles.paymentButton, { backgroundColor: isProcessing ? '#A1A1AA' : currentConfig.theme.primaryColor }]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' }}>
            {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Poppins-Bold',
  },
  backButtonSpacer: {
    width: 40,
  },
  card: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#18181B',
  },
  cardValue: {
    fontSize: 16,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#71717A',
  },
  addressText: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 12,
  },
  changeAddressButton: {
    paddingVertical: 8,
  },
  changeAddressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsBadgeText: {
    fontSize: 12,
  },
  redemptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  earningsBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  paymentButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
