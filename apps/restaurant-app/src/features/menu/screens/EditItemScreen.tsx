import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { TextInput } from '../../../components/common/TextInput';
import { useMenu } from '../hooks/useMenu';
import { mockMenuCategories } from '../../../services/mockData';

type EditItemScreenProps = StackScreenProps<RootStackParamList, 'EditItem'>;

export const EditItemScreen = ({ navigation, route }: EditItemScreenProps) => {
  const { itemId } = route.params;
  const { updateMenuItem } = useMenu();

  const currentItem = mockMenuCategories
    .flatMap((cat) => cat.items)
    .find((item) => item.id === itemId);

  const [name, setName] = useState(currentItem?.name || '');
  const [description, setDescription] = useState(currentItem?.description || '');
  const [price, setPrice] = useState(currentItem?.price?.toString() || '');
  const [preparationTime, setPreparationTime] = useState(currentItem?.preparationTime?.toString() || '');
  const [isAvailable, setIsAvailable] = useState(currentItem?.isAvailable ?? true);
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
      const updates: Partial<{ name: string; description: string; price: number; preparationTime: number; isAvailable: boolean }> = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        preparationTime: parseInt(preparationTime, 10),
        isAvailable,
      };
      await updateMenuItem(itemId, updates);
      Alert.alert('Success', 'Menu item updated');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update menu item');
    }
  };

  if (!currentItem) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50">
      <View className="bg-white px-4 pt-4 pb-3 border-b border-zinc-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="py-2">
            <Text className="text-brand-primary text-base font-semibold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-zinc-900">Edit Menu Item</Text>
          <View className="w-16" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
          <TextInput
            label="Name"
            value={name}
            onChangeText={(text) => { setName(text); setErrors((prev) => ({ ...prev, name: '' })); }}
            error={errors.name}
            placeholder="Enter item name"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="Enter description"
            multiline
            className="h-20"
          />

          <TextInput
            label="Price ($)"
            value={price}
            onChangeText={(text) => { setPrice(text); setErrors((prev) => ({ ...prev, price: '' })); }}
            error={errors.price}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />

          <TextInput
            label="Preparation Time (minutes)"
            value={preparationTime}
            onChangeText={(text) => { setPreparationTime(text); setErrors((prev) => ({ ...prev, time: '' })); }}
            error={errors.time}
            placeholder="10"
            keyboardType="number-pad"
          />

          <View className="flex-row items-center justify-between py-3 border-t border-zinc-200 mt-2">
            <Text className="text-base text-zinc-700">Availability</Text>
            <TouchableOpacity
              onPress={() => setIsAvailable(!isAvailable)}
              className={`w-12 h-7 rounded-full items-center justify-center ${
                isAvailable ? 'bg-brand-success' : 'bg-zinc-300'
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${
                  isAvailable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-1 border border-zinc-300 py-3 rounded-lg items-center"
          >
            <Text className="text-zinc-600 font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 bg-brand-primary py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};