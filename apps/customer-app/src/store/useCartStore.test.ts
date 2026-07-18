import { useCartStore } from './useCartStore';
import { FoodItem } from '../menu/types';

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  ALWAYS_THIS_DEVICE_ONLY: 'ALWAYS_THIS_DEVICE_ONLY',
}));

const mockFoodItem: FoodItem = {
  id: 'item-1',
  name: 'Pad Thai',
  description: 'Delicious Thai noodle dish',
  price: 15.50,
  spice: 2,
  isAvailable: true,
  imageUrl: 'https://example.com/pad-thai.jpg',
};

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useCartStore.getState();
    store.clearCart();
    store.setFulfillmentMethod('delivery');
  });

  describe('initial state', () => {
    it('should start with empty cart', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
    });

    it('should start with delivery as default fulfillment method', () => {
      const state = useCartStore.getState();
      expect(state.fulfillmentMethod).toBe('delivery');
    });
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, ['Extra Sauce']);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe('Pad Thai');
      expect(state.items[0].quantity).toBe(1);
      expect(state.items[0].selectedModifiers).toEqual(['Extra Sauce']);
    });

    it('should increment quantity if item already exists', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      store.addItem(mockFoodItem, []);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should add different items separately', () => {
      const store = useCartStore.getState();
      const item2: FoodItem = {
        ...mockFoodItem,
        id: 'item-2',
        name: 'Green Curry',
      };
      
      store.addItem(mockFoodItem, []);
      store.addItem(item2, []);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      store.removeItem('item-1');
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('should not affect other items when removing', () => {
      const store = useCartStore.getState();
      const item2: FoodItem = {
        ...mockFoodItem,
        id: 'item-2',
        name: 'Green Curry',
      };
      
      store.addItem(mockFoodItem, []);
      store.addItem(item2, []);
      store.removeItem('item-1');
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe('Green Curry');
    });
  });

  describe('updateQuantity', () => {
    it('should increase quantity', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      store.updateQuantity('item-1', 2);
      
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(3); // 1 + 2
    });

    it('should decrease quantity', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      store.addItem(mockFoodItem, []);
      store.addItem(mockFoodItem, []);
      store.updateQuantity('item-1', -1);
      
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(2);
    });

    it('should not go below 1', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      store.updateQuantity('item-1', -5);
      
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      store.addItem(mockFoodItem, []);
      store.clearCart();
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('setFulfillmentMethod', () => {
    it('should set fulfillment method to pickup', () => {
      const store = useCartStore.getState();
      
      store.setFulfillmentMethod('pickup');
      
      const state = useCartStore.getState();
      expect(state.fulfillmentMethod).toBe('pickup');
    });

    it('should set fulfillment method to delivery', () => {
      const store = useCartStore.getState();
      
      store.setFulfillmentMethod('delivery');
      
      const state = useCartStore.getState();
      expect(state.fulfillmentMethod).toBe('delivery');
    });
  });

  describe('getTotal', () => {
    it('should calculate total for single item', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      
      const state = useCartStore.getState();
      expect(state.getTotal()).toBe(15.50);
    });

    it('should calculate total for multiple items', () => {
      const store = useCartStore.getState();
      const item2: FoodItem = {
        ...mockFoodItem,
        id: 'item-2',
        name: 'Green Curry',
        price: 20.00,
      };
      
      store.addItem(mockFoodItem, []);
      store.addItem(item2, []);
      
      const state = useCartStore.getState();
      expect(state.getTotal()).toBe(35.50);
    });

    it('should calculate total with quantity', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockFoodItem, []);
      store.addItem(mockFoodItem, []);
      
      const state = useCartStore.getState();
      expect(state.getTotal()).toBe(31.00); // 15.50 * 2
    });

    it('should return 0 for empty cart', () => {
      const state = useCartStore.getState();
      expect(state.getTotal()).toBe(0);
    });
  });
});