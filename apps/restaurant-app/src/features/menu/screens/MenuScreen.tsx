import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { MenuItem } from '../types';
import { MenuItemCard } from '../components/MenuItemCard';
import { useMenu } from '../hooks/useMenu';

type MenuScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export const MenuScreen = ({ navigation }: MenuScreenProps) => {
  const { categories, isLoading, fetchMenu, toggleAvailability, updateMenuItem } = useMenu();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMenu();
    setRefreshing(false);
  };

  const handleToggle = (item: MenuItem) => {
    Alert.alert(
      'Toggle Availability',
      `Mark "${item.name}" as ${item.isAvailable ? 'unavailable' : 'available'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => toggleAvailability(item.id),
        },
      ]
    );
  };

  const handleEdit = (item: MenuItem) => {
    navigation.navigate('EditItem', { itemId: item.id });
  };

  if (isLoading && !refreshing) {
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
          <Text className="text-2xl font-bold text-zinc-900">Menu</Text>
          <Text className="text-sm text-zinc-500">
            {categories.reduce((sum, cat) => sum + cat.items.length, 0)} items
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        {categories.map((category) => (
          <View key={category.id} className="mb-6">
            <Text className="text-lg font-semibold text-zinc-900 mb-3">
              {category.name} ({category.items.length})
            </Text>
            {category.items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onToggle={() => handleToggle(item)}
              />
            ))}
          </View>
        ))}

        {categories.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-zinc-400 text-base">No menu items</Text>
            <Text className="text-zinc-400 text-sm mt-1">Pull to refresh</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};