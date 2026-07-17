import { useState, useEffect } from 'react';
import { useOrderStore } from '../../../store/orderStore';
import { mockOrders } from '../../../services/mockData';
import { Order } from '../types';

const DELAY_MS = 300;

const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export const useOrders = (status?: string) => {
  const { orders, isLoading, setOrders, updateOrderStatus } = useOrderStore();
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      await simulateApiDelay();
      const data = [...mockOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, [status]);

  const acceptOrder = async (orderId: string) => {
    try {
      await simulateApiDelay();
      updateOrderStatus(orderId, 'Accepted');
      return { success: true };
    } catch (err: any) {
      setError(err?.message || 'Failed to accept order');
      return { success: false };
    }
  };

  const prepareOrder = async (orderId: string) => {
    try {
      await simulateApiDelay();
      updateOrderStatus(orderId, 'Preparing');
      return { success: true };
    } catch (err: any) {
      setError(err?.message || 'Failed to prepare order');
      return { success: false };
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      await simulateApiDelay();
      updateOrderStatus(orderId, 'Completed');
      return { success: true };
    } catch (err: any) {
      setError(err?.message || 'Failed to complete order');
      return { success: false };
    }
  };

  const getOrderById = (orderId: string): Order | null => {
    return orders.find((order) => order.id === orderId) || null;
  };

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    acceptOrder,
    prepareOrder,
    completeOrder,
    getOrderById,
  };
};