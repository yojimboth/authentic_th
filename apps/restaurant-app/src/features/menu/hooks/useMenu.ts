import { useState, useEffect } from 'react';
import { useMenuStore } from '../../../store/menuStore';
import { mockMenuCategories } from '../../../services/mockData';
import { MenuItem, MenuCategory } from '../types';

const DELAY_MS = 300;

const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export const useMenu = () => {
  const { categories, isLoading, setCategories, toggleItemAvailability, updateItem, addItem, deleteItem, addCategory, updateCategory, deleteCategory } = useMenuStore();
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      await simulateApiDelay();
      setCategories(mockMenuCategories);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch menu');
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const toggleAvailability = async (itemId: string) => {
    try {
      toggleItemAvailability(itemId);
      await simulateApiDelay();
      return { success: true };
    } catch (err: any) {
      fetchMenu();
      setError(err?.message || 'Failed to update availability');
      return { success: false };
    }
  };

  const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>) => {
    try {
      updateItem(itemId, updates);
      await simulateApiDelay();
      return { success: true };
    } catch (err: any) {
      fetchMenu();
      setError(err?.message || 'Failed to update menu item');
      return { success: false };
    }
  };

  const addMenuItem = async (categoryName: string, item: Omit<MenuItem, 'id' | 'tenantId'>) => {
    try {
      addItem(categoryName, item);
      await simulateApiDelay();
      return { success: true };
    } catch (err: any) {
      fetchMenu();
      setError(err?.message || 'Failed to add menu item');
      return { success: false };
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    try {
      deleteItem(itemId);
      await simulateApiDelay();
      return { success: true };
    } catch (err: any) {
      fetchMenu();
      setError(err?.message || 'Failed to delete menu item');
      return { success: false };
    }
  };

  const addMenuCategory = async (name: string) => {
    try {
      addCategory(name);
      await simulateApiDelay();
      return { success: true };
    } catch (err: any) {
      fetchMenu();
      setError(err?.message || 'Failed to add category');
      return { success: false };
    }
  };

  const updateMenuCategory = async (categoryId: string, updates: Partial<MenuCategory>) => {
    try {
      updateCategory(categoryId, updates);
      await simulateApiDelay();
      return { success: true };
    } catch (err: any) {
      fetchMenu();
      setError(err?.message || 'Failed to update category');
      return { success: false };
    }
  };

  const deleteMenuCategory = async (categoryId: string) => {
    try {
      deleteCategory(categoryId);
      await simulateApiDelay();
      return { success: true };
    } catch (err: any) {
      fetchMenu();
      setError(err?.message || 'Failed to delete category');
      return { success: false };
    }
  };

  return {
    categories,
    isLoading,
    error,
    fetchMenu,
    toggleAvailability,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
  };
};