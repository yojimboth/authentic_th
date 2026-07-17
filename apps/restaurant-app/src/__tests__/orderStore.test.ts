import { useOrderStore } from '../store/orderStore';
import { Order } from '../features/orders/types';

const mockOrder: Order = {
  id: 'ord_1',
  tenantId: 'tenant_1',
  customerId: 'cust_1',
  customerName: 'John Doe',
  items: [{ id: 'item_1', name: 'Pad Thai', quantity: 1, price: 15.50 }],
  subtotal: 15.50,
  deliveryFee: 5.00,
  loyaltyDiscount: 0,
  total: 20.50,
  status: 'Pending',
  fulfillmentMethod: 'delivery',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('orderStore', () => {
  beforeEach(() => {
    useOrderStore.getState().clearOrders();
  });

  it('starts with empty orders', () => {
    const state = useOrderStore.getState();
    expect(state.orders).toEqual([]);
    expect(state.activeOrder).toBeNull();
  });

  it('sets orders', () => {
    useOrderStore.getState().setOrders([mockOrder]);
    expect(useOrderStore.getState().orders).toHaveLength(1);
    expect(useOrderStore.getState().orders[0].id).toBe('ord_1');
  });

  it('sets active order', () => {
    useOrderStore.getState().setOrders([mockOrder]);
    useOrderStore.getState().setActiveOrder(mockOrder);
    expect(useOrderStore.getState().activeOrder?.id).toBe('ord_1');
  });

  it('updates order status', () => {
    useOrderStore.getState().setOrders([mockOrder]);
    useOrderStore.getState().updateOrderStatus('ord_1', 'Accepted');
    expect(useOrderStore.getState().orders[0].status).toBe('Accepted');
  });

  it('adds a new order', () => {
    useOrderStore.getState().setOrders([mockOrder]);
    const newOrder: Order = {
      ...mockOrder,
      id: 'ord_2',
      status: 'Pending',
    };
    useOrderStore.getState().addOrder(newOrder);
    expect(useOrderStore.getState().orders).toHaveLength(2);
    expect(useOrderStore.getState().orders[0].id).toBe('ord_2');
  });

  it('clears all orders', () => {
    useOrderStore.getState().setOrders([mockOrder]);
    useOrderStore.getState().clearOrders();
    expect(useOrderStore.getState().orders).toEqual([]);
    expect(useOrderStore.getState().activeOrder).toBeNull();
  });
});