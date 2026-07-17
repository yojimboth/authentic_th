import { mockPopularItems, mockSalesSummary } from '../services/mockData';

describe('useAnalytics mock data', () => {
  it('has valid sales summary structure', () => {
    expect(mockSalesSummary).toHaveProperty('totalRevenue');
    expect(mockSalesSummary).toHaveProperty('totalOrders');
    expect(mockSalesSummary).toHaveProperty('averageOrderValue');
    expect(mockSalesSummary).toHaveProperty('period');
    expect(mockSalesSummary.period).toBe('today');
    expect(mockSalesSummary.totalRevenue).toBeGreaterThan(0);
  });

  it('has valid popular items structure', () => {
    expect(mockPopularItems.length).toBeGreaterThan(0);
    mockPopularItems.forEach((item) => {
      expect(item).toHaveProperty('itemId');
      expect(item).toHaveProperty('itemName');
      expect(item).toHaveProperty('quantitySold');
      expect(item).toHaveProperty('revenue');
      expect(item.quantitySold).toBeGreaterThan(0);
      expect(item.revenue).toBeGreaterThan(0);
    });
  });

  it('popular items have descending quantity sold', () => {
    for (let i = 1; i < mockPopularItems.length; i++) {
      expect(mockPopularItems[i - 1].quantitySold).toBeGreaterThanOrEqual(
        mockPopularItems[i].quantitySold
      );
    }
  });
});