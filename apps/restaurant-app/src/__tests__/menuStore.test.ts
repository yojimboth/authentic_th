import { useMenuStore } from '../store/menuStore';
import { MenuCategory, MenuItem } from '../features/menu/types';

const mockCategories: MenuCategory[] = [
  {
    id: 'cat_1',
    tenantId: 'tenant_1',
    name: 'Appetizers',
    displayOrder: 1,
    items: [
      {
        id: 'item_1',
        tenantId: 'tenant_1',
        name: 'Spring Rolls',
        description: 'Crispy spring rolls',
        price: 10.00,
        category: 'Appetizers',
        imageUrl: '',
        isAvailable: true,
        preparationTime: 5,
      },
      {
        id: 'item_2',
        tenantId: 'tenant_1',
        name: 'Satay Chicken',
        description: 'Grilled chicken skewers',
        price: 12.00,
        category: 'Appetizers',
        imageUrl: '',
        isAvailable: true,
        preparationTime: 8,
      },
    ],
  },
];

describe('menuStore', () => {
  beforeEach(() => {
    useMenuStore.getState().clearMenu();
  });

  it('starts with empty categories', () => {
    const state = useMenuStore.getState();
    expect(state.categories).toEqual([]);
  });

  it('sets categories', () => {
    useMenuStore.getState().setCategories(mockCategories);
    expect(useMenuStore.getState().categories).toHaveLength(1);
    expect(useMenuStore.getState().categories[0].name).toBe('Appetizers');
  });

  it('toggles item availability', () => {
    useMenuStore.getState().setCategories(mockCategories);
    useMenuStore.getState().toggleItemAvailability('item_1');
    const item = useMenuStore.getState().categories[0].items[0];
    expect(item.isAvailable).toBe(false);
  });

  it('toggles item availability back', () => {
    useMenuStore.getState().setCategories(mockCategories);
    useMenuStore.getState().toggleItemAvailability('item_1');
    useMenuStore.getState().toggleItemAvailability('item_1');
    const item = useMenuStore.getState().categories[0].items[0];
    expect(item.isAvailable).toBe(true);
  });

  it('updates item', () => {
    useMenuStore.getState().setCategories(mockCategories);
    useMenuStore.getState().updateItem('item_1', { price: 11.00, name: 'Fresh Spring Rolls' });
    const item = useMenuStore.getState().categories[0].items[0];
    expect(item.price).toBe(11.00);
    expect(item.name).toBe('Fresh Spring Rolls');
    expect(item.description).toBe('Crispy spring rolls');
  });

  it('clears all categories', () => {
    useMenuStore.getState().setCategories(mockCategories);
    useMenuStore.getState().clearMenu();
    expect(useMenuStore.getState().categories).toEqual([]);
  });

  it('does not toggle unrelated items', () => {
    useMenuStore.getState().setCategories(mockCategories);
    useMenuStore.getState().toggleItemAvailability('item_1');
    const item2 = useMenuStore.getState().categories[0].items[1];
    expect(item2.isAvailable).toBe(true);
  });
});