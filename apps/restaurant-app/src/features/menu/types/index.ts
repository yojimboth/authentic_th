export interface MenuItem {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime?: number;
}

export interface MenuCategory {
  id: string;
  tenantId: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}