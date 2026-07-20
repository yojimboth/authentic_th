export type OrderStatus = 'Preparing' | 'Out for Delivery' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string; // Security: Required for IDOR protection
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  deliveryAddress?: string | null;
  pointsEarned?: number;
  estimatedDelivery?: string;
  cancellationReason?: string;
}
