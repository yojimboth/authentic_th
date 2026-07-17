import { useState, useEffect } from 'react';
import { mockSalesSummary, mockSalesSummaryWeek, mockSalesSummaryMonth, mockPopularItems } from '../../../services/mockData';
import { SalesSummary, PopularItem } from '../types';

const DELAY_MS = 300;

const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export const useAnalytics = (period: 'today' | 'week' | 'month' = 'today') => {
  const [sales, setSales] = useState<SalesSummary | null>(null);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      await simulateApiDelay();
      let summary: SalesSummary;
      switch (period) {
        case 'week':
          summary = mockSalesSummaryWeek;
          break;
        case 'month':
          summary = mockSalesSummaryMonth;
          break;
        default:
          summary = mockSalesSummary;
      }
      setSales(summary);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch sales data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopular = async () => {
    try {
      await simulateApiDelay();
      setPopularItems(mockPopularItems);
    } catch (err: any) {
      console.error('Failed to fetch popular items:', err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchPopular();
  }, [period]);

  const refetch = () => {
    fetchSales();
    fetchPopular();
  };

  return {
    sales,
    popularItems,
    isLoading,
    error,
    refetch,
  };
};