import { mockOrders, mockMenuCategories, mockSalesSummary, mockPopularItems, mockRestaurantOwner } from '../services/mockData';

describe('mockData', () => {
  describe('mockOrders', () => {
    it('has multiple orders', () => {
      expect(mockOrders.length).toBeGreaterThanOrEqual(5);
    });

    it('has orders with different statuses', () => {
      const statuses = new Set(mockOrders.map((o) => o.status));
      expect(statuses.size).toBeGreaterThanOrEqual(4);
    });

    it('orders have all required fields', () => {
      const order = mockOrders[0];
      expect(order.id).toBeTruthy();
      expect(order.tenantId).toBeTruthy();
      expect(order.items).toBeTruthy();
      expect(order.total).toBeGreaterThan(0);
      expect(order.status).toBeTruthy();
    });

    it('orders have proper date formats', () => {
      mockOrders.forEach((order) => {
        expect(() => new Date(order.createdAt).getTime()).not.toThrow();
        expect(() => new Date(order.updatedAt).getTime()).not.toThrow();
      });
    });
  });

  describe('mockMenuCategories', () => {
    it('has multiple categories', () => {
      expect(mockMenuCategories.length).toBeGreaterThanOrEqual(3);
    });

    it('has total items across categories', () => {
      const totalItems = mockMenuCategories.reduce((sum, cat) => sum + cat.items.length, 0);
      expect(totalItems).toBeGreaterThanOrEqual(10);
    });

    it('categories have required fields', () => {
      mockMenuCategories.forEach((cat) => {
        expect(cat.id).toBeTruthy();
        expect(cat.name).toBeTruthy();
        expect(cat.items.length).toBeGreaterThan(0);
      });
    });

    it('menu items have required fields', () => {
      mockMenuCategories.forEach((cat) => {
        cat.items.forEach((item) => {
          expect(item.id).toBeTruthy();
          expect(item.name).toBeTruthy();
          expect(item.price).toBeGreaterThan(0);
          expect(typeof item.isAvailable).toBe('boolean');
        });
      });
    });
  });

  describe('mockSalesSummary', () => {
    it('has revenue data', () => {
      expect(mockSalesSummary.totalRevenue).toBeGreaterThan(0);
      expect(mockSalesSummary.totalOrders).toBeGreaterThan(0);
      expect(mockSalesSummary.averageOrderValue).toBeGreaterThan(0);
    });

    it('has trend data', () => {
      expect(mockSalesSummary.trend).toBeTruthy();
      expect(mockSalesSummary.trend?.revenue).toBeTruthy();
      expect(mockSalesSummary.trend?.orders).toBeTruthy();
    });
  });

  describe('mockPopularItems', () => {
    it('has multiple popular items', () => {
      expect(mockPopularItems.length).toBeGreaterThanOrEqual(5);
    });

    it('items have required fields', () => {
      mockPopularItems.forEach((item) => {
        expect(item.itemId).toBeTruthy();
        expect(item.itemName).toBeTruthy();
        expect(item.quantitySold).toBeGreaterThan(0);
        expect(item.revenue).toBeGreaterThan(0);
      });
    });

    it('items are sorted by quantity (descending)', () => {
      for (let i = 1; i < mockPopularItems.length; i++) {
        expect(mockPopularItems[i - 1].quantitySold).toBeGreaterThanOrEqual(mockPopularItems[i].quantitySold);
      }
    });
  });

  describe('mockRestaurantOwner', () => {
    it('has all required fields', () => {
      expect(mockRestaurantOwner.id).toBeTruthy();
      expect(mockRestaurantOwner.tenantId).toBeTruthy();
      expect(mockRestaurantOwner.fullName).toBeTruthy();
      expect(mockRestaurantOwner.email).toBeTruthy();
      expect(mockRestaurantOwner.role).toBe('owner');
    });

    it('has valid email format', () => {
      expect(mockRestaurantOwner.email).toContain('@');
    });
  });
});