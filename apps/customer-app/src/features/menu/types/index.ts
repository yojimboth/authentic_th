export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  spice: number;
  isAvailable: boolean;
  imageUrl: string;
}

export interface MenuCategory {
  category: string;
  items: FoodItem[];
}

export type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
