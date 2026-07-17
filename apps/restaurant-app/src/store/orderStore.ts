import { create } from 'zustand';
import { Order, OrderStatus } from '../features/orders/types';

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;
  setOrders: (orders: Order[]) => void;
  setActiveOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
  clearOrders: () => void;
  setError: (error: string | null) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  activeOrder: null,
  isLoading: false,
  setOrders: (orders) => set({ orders }),
  setActiveOrder: (order) => set({ activeOrder: order }),
  updateOrderStatus: (orderId, status) => set((state) => {
    const updated = state.orders.map((o) =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    const activeOrder = state.activeOrder?.id === orderId
      ? { ...state.activeOrder, status, updatedAt: new Date().toISOString() }
      : state.activeOrder;
    return { orders: updated, activeOrder };
  }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  clearOrders: () => set({ orders: [], activeOrder: null }),
  setError: () => {},
}));