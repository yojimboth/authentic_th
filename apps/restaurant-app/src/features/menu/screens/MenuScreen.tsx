import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { MenuItem, MenuCategory } from '../types';
import { MenuItemCard } from '../components/MenuItemCard';
import { useMenu } from '../hooks/useMenu';

type MenuScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export const MenuScreen = ({ navigation }: MenuScreenProps) => {
  const { categories, isLoading, fetchMenu, toggleAvailability, updateMenuItem, deleteMenuItem, addMenuCategory, updateMenuCategory, deleteMenuCategory, addMenuItem } = useMenu();
  const [refreshing, setRefreshing] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  const handleDelete = (item: MenuItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMenuItem(item.id),
        },
      ]
    );
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setCategoryModalVisible(true);
  };

  const openEditCategoryModal = (category: MenuCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setCategoryModalVisible(true);
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }

    if (editingCategory) {
      await updateMenuCategory(editingCategory.id, { name: newCategoryName.trim() });
      Alert.alert('Success', 'Category updated');
    } else {
      await addMenuCategory(newCategoryName.trim());
      Alert.alert('Success', 'Category added');
    }
    setCategoryModalVisible(false);
  };

  const handleDeleteCategory = (category: MenuCategory) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? All items in this category will be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMenuCategory(category.id);
            Alert.alert('Success', 'Category deleted');
          },
        },
      ]
    );
  };

  const handleAddItem = (categoryName: string) => {
    navigation.navigate('EditItem', {
      categoryId: categoryName,
      isNew: true,
    });
  };

  const handleFABPress = () => {
    if (categories.length > 0) {
      handleAddItem(categories[0].name);
    } else {
      Alert.alert('No Categories', 'Please add a category first before adding items.');
    }
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Menu</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={openAddCategoryModal} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>+ Category</Text>
            </TouchableOpacity>
            <Text style={styles.itemCount}>{totalItems} items</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <View style={styles.categoryHeaderRow}>
              <Text style={styles.categoryTitle}>
                {category.name} ({category.items.length})
              </Text>
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  onPress={() => openEditCategoryModal(category)}
                  style={styles.categoryActionButton}
                >
                  <Text style={styles.categoryActionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteCategory(category)}
                  style={styles.categoryActionButton}
                >
                  <Text style={styles.categoryActionDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
            {category.items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onToggle={() => handleToggle(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </View>
        ))}

        {categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories</Text>
            <Text style={styles.emptySubtext}>Tap "+ Category" to add one</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button for quick add item */}
      {categories.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleFABPress}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Category name"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setCategoryModalVisible(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveCategory}
                style={styles.modalSaveButton}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
  },
  headerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  scrollContent: {
    flex: 1,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  categoryActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  categoryActionDeleteText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#991B1B',
    fontFamily: 'Inter-Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: 'Inter-SemiBold',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    marginTop: -2,
  },
});