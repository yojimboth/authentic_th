import { useState, useEffect } from 'react';
import { useMenuStore } from '../../../store/menuStore';
import { mockMenuCategories } from '../../../services/mockData';
import { MenuItem } from '../types';

const DELAY_MS = 300;

const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export const useMenu = () => {
  const { categories, isLoading, setCategories, toggleItemAvailability, updateItem } = useMenuStore();
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

  return {
    categories,
    isLoading,
    error,
    fetchMenu,
    toggleAvailability,
    updateMenuItem,
  };
};