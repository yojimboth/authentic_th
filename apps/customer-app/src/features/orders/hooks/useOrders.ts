import { useState, useEffect } from 'react';
import { Order } from '../types';
import { getCurrentUserId } from '../../../utils/mockAuth';

const MOCK_ORDERS: Order[] = [
  // ─── Active Orders ────────────────────────────────────────────────
  
  // Order 1: Preparing
  {
    id: 'ORD-20260719-001',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    total: 45.90,
    status: 'Preparing',
    items: [
      { id: 'item_001', name: 'Pad Thai', quantity: 2, price: 15.90 },
      { id: 'item_002', name: 'Spring Rolls', quantity: 1, price: 8.90 },
      { id: 'item_003', name: 'Thai Tea', quantity: 1, price: 5.00 },
    ],
    deliveryAddress: '123 George St, Sydney NSW 2000',
    pointsEarned: 45,
    estimatedDelivery: '30-40 mins',
  },
  
  // Order 2: Out for Delivery
  {
    id: 'ORD-20260719-002',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    total: 44.70,
    status: 'Out for Delivery',
    items: [
      { id: 'item_004', name: 'Green Curry', quantity: 1, price: 16.90 },
      { id: 'item_005', name: 'Jasmine Rice', quantity: 1, price: 4.00 },
      { id: 'item_006', name: 'Tom Yum Soup', quantity: 1, price: 13.90 },
      { id: 'item_007', name: 'Mango Sticky Rice', quantity: 1, price: 9.90 },
    ],
    deliveryAddress: '456 Pitt St, Sydney NSW 2000',
    pointsEarned: 44,
    estimatedDelivery: '10-15 mins',
  },
  
  // Order 3: Ready for Pickup
  {
    id: 'ORD-20260719-003',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    total: 28.90,
    status: 'Ready',
    items: [
      { id: 'item_008', name: 'Pad Kra Pao', quantity: 1, price: 14.90 },
      { id: 'item_009', name: 'Fried Rice', quantity: 1, price: 14.00 },
    ],
    deliveryAddress: null, // Pickup order
    pointsEarned: 28,
    estimatedDelivery: 'Ready for pickup',
  },
  
  // ─── Completed Orders ────────────────────────────────────────────
  
  // Order 4: Completed (yesterday)
  {
    id: 'ORD-20260718-001',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    total: 68.20,
    status: 'Completed',
    items: [
      { id: 'item_010', name: 'Massaman Curry', quantity: 2, price: 18.50 },
      { id: 'item_011', name: 'Panang Curry', quantity: 1, price: 17.50 },
      { id: 'item_012', name: 'Thai Tea', quantity: 2, price: 5.00 },
      { id: 'item_013', name: 'Banana Fritters', quantity: 1, price: 8.50 },
    ],
    deliveryAddress: '789 Kent St, Sydney NSW 2000',
    pointsEarned: 68,
  },
  
  // Order 5: Completed (2 days ago)
  {
    id: 'ORD-20260717-001',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    total: 52.40,
    status: 'Completed',
    items: [
      { id: 'item_014', name: 'Red Curry', quantity: 1, price: 16.90 },
      { id: 'item_015', name: 'Drunken Noodles', quantity: 1, price: 15.50 },
      { id: 'item_016', name: 'Satay Chicken', quantity: 2, price: 12.50 },
      { id: 'item_017', name: 'Mango Sticky Rice', quantity: 1, price: 9.90 },
    ],
    deliveryAddress: '321 Sussex St, Sydney NSW 2000',
    pointsEarned: 52,
  },
  
  // Order 6: Completed (last week)
  {
    id: 'ORD-20260712-001',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    total: 89.90,
    status: 'Completed',
    items: [
      { id: 'item_018', name: 'Family Platter', quantity: 1, price: 65.00 },
      { id: 'item_019', name: 'Thai Tea', quantity: 4, price: 5.00 },
      { id: 'item_020', name: 'Spring Rolls', quantity: 2, price: 8.90 },
      { id: 'item_021', name: 'Banana Fritters', quantity: 2, price: 8.50 },
    ],
    deliveryAddress: '123 George St, Sydney NSW 2000',
    pointsEarned: 89,
  },
  
  // ─── Cancelled Orders ────────────────────────────────────────────
  
  // Order 7: Cancelled
  {
    id: 'ORD-20260716-001',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    total: 24.50,
    status: 'Cancelled',
    items: [
      { id: 'item_022', name: 'Basil Chicken', quantity: 1, price: 14.90 },
      { id: 'item_023', name: 'Jasmine Rice', quantity: 1, price: 4.00 },
      { id: 'item_024', name: 'Thai Tea', quantity: 1, price: 5.00 },
    ],
    deliveryAddress: '456 Pitt St, Sydney NSW 2000',
    pointsEarned: 0,
    cancellationReason: 'Changed my mind',
  },
  
  // Order 8: Cancelled (restaurant cancelled)
  {
    id: 'ORD-20260710-001',
    userId: '__CURRENT_USER__',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(), // 9 days ago
    total: 42.80,
    status: 'Cancelled',
    items: [
      { id: 'item_025', name: 'Green Curry', quantity: 2, price: 16.90 },
      { id: 'item_026', name: 'Jasmine Rice', quantity: 2, price: 4.00 },
    ],
    deliveryAddress: '789 Kent St, Sydney NSW 2000',
    pointsEarned: 0,
    cancellationReason: 'Restaurant unable to fulfill order',
  },
  
  // ─── Other Users' Orders (should be filtered out) ────────────────
  
  {
    id: 'ORD-20260719-100',
    userId: 'user_002',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    total: 55.00,
    status: 'Completed',
    items: [
      { id: 'item_099', name: 'Massaman Curry', quantity: 2, price: 27.50 },
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
    // Current user ID is derived dynamically from mockAuth to avoid hardcoded identity
    const currentUser = getCurrentUserId();
    const timer = setTimeout(() => {
      // Filter orders by current user ID (simulates backend security)
      // Match both dynamic user IDs and the __CURRENT_USER__ placeholder
      const userOrders = MOCK_ORDERS.filter(
        order => order.userId === currentUser || order.userId === '__CURRENT_USER__'
      );
      setOrders(userOrders);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { orders, loading };
};
