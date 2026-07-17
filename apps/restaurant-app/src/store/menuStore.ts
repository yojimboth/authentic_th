import { create } from 'zustand';
import { MenuItem, MenuCategory } from '../features/menu/types';

interface MenuState {
  categories: MenuCategory[];
  isLoading: boolean;
  setCategories: (categories: MenuCategory[]) => void;
  toggleItemAvailability: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<MenuItem>) => void;
  clearMenu: () => void;
  setError: (error: string | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  categories: [],
  isLoading: false,
  setCategories: (categories) => set({ categories }),
  toggleItemAvailability: (itemId) => set((state) => ({
    categories: state.categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      ),
    })),
  })),
  updateItem: (itemId, updates) => set((state) => ({
    categories: state.categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    })),
  })),
  clearMenu: () => set({ categories: [] }),
  setError: () => {},
}));