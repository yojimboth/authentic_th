export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  period: 'today' | 'week' | 'month';
  trend?: {
    revenue: number;
    orders: number;
  };
}

export interface PopularItem {
  itemId: string;
  itemName: string;
  quantitySold: number;
  revenue: number;
}