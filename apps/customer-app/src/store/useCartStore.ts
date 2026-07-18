import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { FoodItem } from '../features/menu/types';

interface CartItem extends FoodItem {
  quantity: number;
  selectedModifiers: string[];
}

type FulfillmentMethod = 'delivery' | 'pickup';

interface CartState {
  items: CartItem[];
  fulfillmentMethod: FulfillmentMethod;
  setFulfillmentMethod: (method: FulfillmentMethod) => void;
  addItem: (item: FoodItem, modifiers: string[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CART_STORAGE_KEY = '@auth_cart';

const secureStorePersist = createJSONStorage(() => ({
  getItem: async (key: string) => {
    if (key !== CART_STORAGE_KEY) return null;
    try {
      const value = await SecureStore.getItemAsync(CART_STORAGE_KEY);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (key !== CART_STORAGE_KEY) return;
    try {
      await SecureStore.setItemAsync(CART_STORAGE_KEY, value, {
        keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
      });
    } catch {
      // Silently fail - cart data is non-critical
    }
  },
  removeItem: async (key: string) => {
    if (key !== CART_STORAGE_KEY) return;
    try {
      await SecureStore.deleteItemAsync(CART_STORAGE_KEY);
    } catch {
      // Silently fail
    }
  },
}));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      fulfillmentMethod: 'delivery',
      setFulfillmentMethod: (method) => set({ fulfillmentMethod: method }),
      addItem: (item, modifiers) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(i => i.id === item.id);

        if (existingItem) {
          set({
            items: currentItems.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1, selectedModifiers: modifiers }],
          });
        }
      },
      removeItem: (itemId) => set({
        items: get().items.filter(i => i.id !== itemId),
      }),
      updateQuantity: (itemId, delta) => set({
        items: get().items.map(i => 
          i.id === itemId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        ),
      }),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: secureStorePersist,
    }
  )
);

// SECURITY: Cleanup function for stale cart data (data retention compliance)
export const cleanupCartData = async () => {
  try {
    // SECURITY: Remove completed/cancelled orders older than 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Cart store does not currently store order history, so this is a placeholder
    // for future implementation when order history is persisted client-side
    console.log('Cart cleanup: No stale data to remove', { thirtyDaysAgo });
  } catch (error) {
    console.error('Cart cleanup failed:', error);
  }
};
