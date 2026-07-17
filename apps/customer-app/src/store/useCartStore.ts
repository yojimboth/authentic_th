import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '../menu/types';

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
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
