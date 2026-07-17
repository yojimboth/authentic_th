export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
}

export interface Order {
  id: string;
  tenantId: string;
  customerId: string | null;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  loyaltyDiscount: number;
  total: number;
  status: OrderStatus;
  fulfillmentMethod: 'delivery' | 'pickup';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}