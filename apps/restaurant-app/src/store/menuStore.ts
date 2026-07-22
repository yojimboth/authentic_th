import { create } from 'zustand';
import { MenuItem, MenuCategory } from '../features/menu/types';

interface MenuState {
  categories: MenuCategory[];
  isLoading: boolean;
  setCategories: (categories: MenuCategory[]) => void;
  toggleItemAvailability: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<MenuItem>) => void;
  addItem: (categoryName: string, item: Omit<MenuItem, 'id' | 'tenantId'>) => void;
  deleteItem: (itemId: string) => void;
  addCategory: (name: string) => void;
  updateCategory: (categoryId: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (categoryId: string) => void;
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
  addItem: (categoryName, newItem) => set((state) => ({
    categories: state.categories.map((cat) =>
      cat.name === categoryName
        ? {
            ...cat,
            items: [
              ...cat.items,
              {
                ...newItem,
                id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                tenantId: cat.tenantId,
              },
            ],
          }
        : cat
    ),
  })),
  deleteItem: (itemId) => set((state) => ({
    categories: state.categories.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.id !== itemId),
    })),
  })),
  addCategory: (name) => set((state) => ({
    categories: [
      ...state.categories,
      {
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: 'tenant_001',
        name,
        displayOrder: state.categories.length,
        items: [],
      },
    ],
  })),
  updateCategory: (categoryId, updates) => set((state) => ({
    categories: state.categories.map((cat) =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ),
  })),
  deleteCategory: (categoryId) => set((state) => ({
    categories: state.categories.filter((cat) => cat.id !== categoryId),
  })),
  clearMenu: () => set({ categories: [] }),
  setError: () => {},
}));