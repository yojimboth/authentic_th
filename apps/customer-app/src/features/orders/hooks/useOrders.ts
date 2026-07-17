import { useState, useEffect } from 'react';
import { Order } from '../types';
import { getCurrentUserId } from '../../../utils/mockAuth';

// Current user ID for filtering (simulates authenticated user)
const CURRENT_USER_ID = getCurrentUserId();

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    userId: CURRENT_USER_ID, // Security: User ownership for IDOR protection
    date: '2023-10-27T10:30:00Z',
    total: 45.50,
    status: 'Preparing',
    items: [
      { id: 'i1', name: 'Pad Thai', quantity: 1, price: 15.50 },
      { id: 'i2', name: 'Green Curry', quantity: 1, price: 20.00 },
      { id: 'i3', name: 'Spring Rolls', quantity: 1, price: 10.00 },
    ],
    deliveryAddress: '123 Maple St, Sydney NSW 2000',
    pointsEarned: 45,
  },
  {
    id: 'ORD-1002',
    userId: CURRENT_USER_ID, // Security: User ownership for IDOR protection
    date: '2023-10-27T11:15:00Z',
    total: 32.00,
    status: 'Out for Delivery',
    items: [
      { id: 'i4', name: 'Tom Yum Soup', quantity: 2, price: 16.00 },
      { id: 'i5', name: 'Mango Sticky Rice', quantity: 1, price: 16.00 },
    ],
    deliveryAddress: '456 Oak Ave, Sydney NSW 2000',
    pointsEarned: 32,
  },
  {
    id: 'ORD-998',
    userId: CURRENT_USER_ID, // Security: User ownership for IDOR protection
    date: '2023-10-20T18:45:00Z',
    total: 68.20,
    status: 'Completed',
    items: [
      { id: 'i6', name: 'Family Platter', quantity: 1, price: 50.00 },
      { id: 'i7', name: 'Thai Tea', quantity: 2, price: 18.20 },
    ],
    deliveryAddress: '789 Pine Rd, Sydney NSW 2000',
    pointsEarned: 68,
  },
  {
    id: 'ORD-995',
    userId: CURRENT_USER_ID, // Security: User ownership for IDOR protection
    date: '2023-10-15T12:00:00Z',
    total: 22.50,
    status: 'Cancelled',
    items: [
      { id: 'i8', name: 'Basil Chicken', quantity: 1, price: 22.50 },
    ],
    deliveryAddress: '321 Birch Ln, Sydney NSW 2000',
    pointsEarned: 0,
  },
  // Other users' orders (should not be visible to current user)
  {
    id: 'ORD-2001',
    userId: 'user_002', // Different user - should be filtered out
    date: '2023-10-27T09:00:00Z',
    total: 55.00,
    status: 'Completed',
    items: [
      { id: 'i9', name: 'Massaman Curry', quantity: 2, price: 27.50 },
    ],
    deliveryAddress: '999 Other St, Melbourne VIC 3000',
    pointsEarned: 55,
  },
];

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with user filtering (security: only return user's orders)
    const timer = setTimeout(() => {
      // Filter orders by current user ID (simulates backend security)
      const userOrders = MOCK_ORDERS.filter(order => order.userId === CURRENT_USER_ID);
      setOrders(userOrders);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { orders, loading };
};
