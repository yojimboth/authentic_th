import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { FoodItem } from '../types';
import { Button } from '../../../components/common/Button';
import { currentConfig } from '../../../config/whiteLabelConfig';

interface FoodItemCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
  category?: string;
}

// Category theme using design system colors (brand-secondary for accent)
const getCategoryAccent = (category?: string): string => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('appetizer')) return 'bg-amber-50 border-amber-200';
  if (cat.includes('curry')) return 'bg-rose-50 border-rose-200';
  if (cat.includes('noodle')) return 'bg-yellow-50 border-yellow-200';
  if (cat.includes('rice')) return 'bg-orange-50 border-orange-200';
  if (cat.includes('soup')) return 'bg-blue-50 border-blue-200';
  if (cat.includes('dessert')) return 'bg-pink-50 border-pink-200';
  return 'bg-zinc-50 border-zinc-200';
};

export const FoodItemCard = ({ item, onAddToCart, category }: FoodItemCardProps) => {
  const accentClass = getCategoryAccent(category);
  const [imageError, setImageError] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart(item);
  };

  return (
    <View style={styles.card}>
      {/* Food Image - 1:1 aspect ratio per design system */}
      <View style={styles.imageContainer}>
        {item.imageUrl && !imageError ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.foodImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.imagePlaceholder, getCategoryAccent(category)]}>
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {/* Header: Name only */}
        <View style={styles.header}>
          <Typography variant="h3" style={styles.title} numberOfLines={1} fontWeight="bold">
            {item.name}
          </Typography>
        </View>

        {/* Spice Indicator - Below header */}
        <View style={styles.spiceContainer}>
          {[...Array(5)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.spiceDot, 
                { backgroundColor: i < item.spice ? '#F43F5E' : '#E4E4E7' }
              ]} 
            />
          ))}
        </View>

        {/* Description */}
        <Typography 
          variant="body" 
          style={styles.description} 
          numberOfLines={2}
          className="text-zinc-900"
        >
          {item.description}
        </Typography>

        {/* Footer: Price + Add Button */}
        <View style={styles.footer}>
          <Typography 
            variant="h2" 
            style={[styles.price, { color: currentConfig.theme.primaryColor }]}
            fontWeight="bold"
          >
            ${item.price.toFixed(2)}
          </Typography>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: currentConfig.theme.primaryColor }]}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={[styles.addButtonText, { color: '#FFFFFF' }]}>
              Add to Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    color: '#18181B',
  },
  spiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spiceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  price: {
    color: '#18181B',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontWeight: '500',
    fontSize: 14,
  },
});

