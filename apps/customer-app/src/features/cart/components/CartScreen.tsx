import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../../components/common/Typography';
import { useCartStore } from '../../../store/useCartStore';
import { FoodItem } from '../../menu/types';
import { currentConfig } from '../../../config/whiteLabelConfig';

// CartItem type with required properties
interface CartItem extends FoodItem {
  quantity: number;
  selectedModifiers: string[];
}

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
      <View style={styles.emptyContainer}>
        <Typography variant="h2" style={styles.emptyTitle}>Your Cart is Empty</Typography>
        <Typography variant="body" style={styles.emptySubtitle}>
          Looks like you haven't added any Thai delicacies yet.
        </Typography>
        <TouchableOpacity 
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })} 
          style={[styles.browseButton, { backgroundColor: currentConfig.theme.primaryColor }]}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' }}>
            Browse Menu
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Your Order</Text>
        </View>

        {/* Fulfillment Selection */}
        <View style={styles.fulfillmentCard}>
          <Typography variant="h3" style={styles.fulfillmentTitle}>Delivery or Pickup?</Typography>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              onPress={() => setFulfillmentMethod('delivery')}
              style={[
                styles.toggleButton,
                fulfillmentMethod === 'delivery' && styles.toggleButtonActive
              ]}
            >
              <Text style={[
                styles.toggleText,
                fulfillmentMethod === 'delivery' && styles.toggleTextActive
              ]}>
                Delivery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFulfillmentMethod('pickup')}
              style={[
                styles.toggleButton,
                fulfillmentMethod === 'pickup' && styles.toggleButtonActive
              ]}
            >
              <Text style={[
                styles.toggleText,
                fulfillmentMethod === 'pickup' && styles.toggleTextActive
              ]}>
                Pickup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Typography variant="h3" style={styles.itemName}>{item.name}</Typography>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
              </View>
              
              <View style={styles.quantityControl}>
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity 
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                onPress={() => removeItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Typography variant="body" style={styles.summaryLabel}>Subtotal</Typography>
          <Typography variant="body" style={styles.summaryValue}>${total.toFixed(2)}</Typography>
        </View>
        
        {currentDeliveryFee > 0 && (
          <View style={styles.summaryRow}>
            <Typography variant="body" style={styles.summaryLabel}>Delivery Fee</Typography>
            <Typography variant="body" style={styles.summaryValue}>${currentDeliveryFee.toFixed(2)}</Typography>
          </View>
        )}
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Typography variant="h2" style={styles.totalLabel}>Total</Typography>
          <Typography variant="h2" style={[styles.totalValue, { color: currentConfig.theme.primaryColor }]}>
            ${finalTotal.toFixed(2)}
          </Typography>
        </View>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Checkout')} 
          style={[styles.checkoutButton, { backgroundColor: currentConfig.theme.primaryColor }]}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' }}>
            Proceed to Checkout
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Poppins-Bold',
  },
  fulfillmentCard: {
    marginHorizontal: 16,
    marginBottom: 24,
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
  fulfillmentTitle: {
    marginBottom: 12,
    color: '#18181B',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: currentConfig.theme.primaryColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717A',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    marginBottom: 4,
    color: '#18181B',
  },
  itemPrice: {
    fontSize: 14,
    color: '#71717A',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginLeft: 12,
  },
  qtyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#18181B',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F43F5E',
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#71717A',
  },
  summaryValue: {
    color: '#18181B',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    marginBottom: 16,
  },
  totalLabel: {
    color: '#18181B',
  },
  totalValue: {
    color: '#18181B',
    fontWeight: '700',
  },
  checkoutButton: {
    paddingVertical: 16,
    backgroundColor: currentConfig.theme.primaryColor,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#18181B',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#71717A',
  },
  browseButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
