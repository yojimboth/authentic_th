import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { useMenu } from '../hooks/useMenu';
import { mockMenuCategories } from '../../../services/mockData';

type EditItemScreenProps = StackScreenProps<RootStackParamList, 'EditItem'>;

export const EditItemScreen = ({ navigation, route }: EditItemScreenProps) => {
  const { itemId, categoryId, isNew } = route.params as {
    itemId?: string;
    categoryId?: string;
    isNew?: boolean;
  };
  const { updateMenuItem, addMenuItem } = useMenu();

  const currentItem = isNew || !itemId ? null : mockMenuCategories
    .flatMap((cat) => cat.items)
    .find((item) => item.id === itemId);

  const defaultCategory = categoryId || (currentItem ? currentItem.category : 'Main Course');

  const [name, setName] = useState(currentItem?.name || '');
  const [description, setDescription] = useState(currentItem?.description || '');
  const [price, setPrice] = useState(currentItem?.price?.toString() || '');
  const [preparationTime, setPreparationTime] = useState(currentItem?.preparationTime?.toString() || '');
  const [isAvailable, setIsAvailable] = useState(currentItem?.isAvailable ?? true);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.length > 100) newErrors.name = 'Name must be under 100 characters';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    } else if (Number(price) > 999.99) {
      newErrors.price = 'Price must be under $999.99';
    } else if (price.includes('.') && price.split('.')[1]?.length > 2) {
      newErrors.price = 'Max 2 decimal places';
    }
    if (!preparationTime || isNaN(Number(preparationTime)) || Number(preparationTime) < 1) {
      newErrors.time = 'Must be at least 1 minute';
    } else if (Number(preparationTime) > 60) {
      newErrors.time = 'Must be 60 minutes or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (isNew || !itemId) {
        // Add new item
        await addMenuItem(selectedCategory, {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          preparationTime: parseInt(preparationTime, 10),
          isAvailable,
          category: selectedCategory,
          tenantId: 'tenant_001',
          imageUrl: '',
        });
      } else {
        // Update existing item
        const updates: Partial<MenuItem> = {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          preparationTime: parseInt(preparationTime, 10),
          isAvailable,
        };
        if (selectedCategory !== currentItem!.category) {
          updates.category = selectedCategory;
        }
        await updateMenuItem(itemId, updates);
      }
      Alert.alert('Success', isNew ? 'Menu item created' : 'Menu item updated');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save menu item');
    }
  };

  if (!currentItem && !isNew) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <Text style={styles.title}>
          {isNew ? 'Add Menu Item' : 'Edit Menu Item'}
        </Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Item Details Card */}
        <View style={styles.card}>
          {/* Category Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
              {mockMenuCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.name)}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.name && styles.categoryChipActive,
                  ]}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === cat.name && styles.categoryChipTextActive,
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <RNTextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={(text) => { setName(text); setErrors((prev) => ({ ...prev, name: '' })); }}
              placeholder="Enter item name"
              maxLength={100}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <RNTextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={(text) => setDescription(text)}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Price Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price ($)</Text>
            <RNTextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={price}
              onChangeText={(text) => { setPrice(text); setErrors((prev) => ({ ...prev, price: '' })); }}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
          </View>

          {/* Preparation Time Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preparation Time (minutes)</Text>
            <RNTextInput
              style={[styles.input, errors.time && styles.inputError]}
              value={preparationTime}
              onChangeText={(text) => { setPreparationTime(text); setErrors((prev) => ({ ...prev, time: '' })); }}
              placeholder="10"
              keyboardType="number-pad"
            />
            {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
          </View>

          {/* Availability Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Availability</Text>
            <TouchableOpacity
              onPress={() => setIsAvailable(!isAvailable)}
              style={[styles.toggleTrack, { backgroundColor: isAvailable ? '#10B981' : '#D1D5DB' }]}
            >
              <View style={[
                styles.toggleThumb,
                { transform: [{ translateX: isAvailable ? 20 : 0 }] },
              ]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.actionButton, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.actionButton, styles.saveButton]}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 12,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  headerSpacer: {
    width: 64,
  },
  scrollContent: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  categorySelector: {
    maxHeight: 40,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#4F46E5',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    minHeight: 44,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#EF4444',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  bottomSpacer: {
    height: 16,
  },
});