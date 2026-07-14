import axios from 'axios';
import qs from 'qs';

/**
 * Authoritative API Client for the authentic_th ecosystem.
 * In the "Frontend-First" phase, this uses a Mock-Double interceptor.
 * In the "Backend" phase, the interceptor is removed to hit the Rust server.
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.authentic-th.com.au/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const DEFAULT_TENANT_ID = 'tenant_siam_001';

// --- MOCK DATA SOURCE (Tenant-Aware) ---
const MOCK_DATA = {
  tenants: {
    tenant_siam_001: {
      name: 'Siam Authentic',
      menu: [
        {
          category: 'Promotion',
          items: [
            { id: 'm1-p1', name: 'Lunch Special Bundle', description: 'Green Curry + Jasmine Rice + Thai Iced Tea', price: 22.50, spice: 2, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Lunch+Special+Bundle' },
            { id: 'm1-p2', name: 'Family Feast Pack', description: '3 Mains, 2 Entrees, Large Mixed Rice', price: 85.00, spice: 2, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Family+Feast+Pack' },
          ]
        },
        {
          category: 'Entree',
          items: [
            { id: 'm1-e1', name: 'Chicken Satay', description: 'Grilled skewers with peanut sauce', price: 12.00, spice: 1, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Chicken+Satay' },
            { id: 'm1-e2', name: 'Pork Spring Rolls', description: 'Hand-rolled vegetables and minced pork', price: 10.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Pork+Spring+Rolls' },
          ]
        },
        {
          category: 'Curries',
          items: [
            { id: 'm1-c1', name: 'Green Curry', description: 'Spicy coconut curry with bamboo shoots', price: 21.00, spice: 3, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Green+Curry' },
            { id: 'm1-c4', name: 'Massaman Curry', description: 'Mild potato and peanut curry (slow cooked)', price: 23.00, spice: 1, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Massaman+Curry' },
          ]
        },
        {
          category: 'Desserts',
          items: [
            { id: 'm1-d1', name: 'Mango Sticky Rice', description: 'Fresh mango with sweet coconut sticky rice', price: 15.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Mango+Sticky+Rice' },
            { id: 'm1-d2', name: 'Thai Fried Banana', description: 'Crispy bananas with honey and sesame seeds', price: 12.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Thai+Fried+Banana' },
            { id: 'm1-d3', name: 'Coconut Ice Cream', description: 'Homemade coconut ice cream with peanuts', price: 11.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Coconut+Ice+Cream' },
            { id: 'm1-d4', name: 'Tub Tim Krob', description: 'Water chestnut rubies in coconut milk', price: 13.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Tub+Tim+Krob' },
          ]
        },
        {
          category: 'Beverages',
          items: [
            { id: 'm1-be1', name: 'Thai Iced Tea', description: 'Sweet creamy tea with condensed milk', price: 7.50, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Thai+Iced+Tea' },
            { id: 'm1-be2', name: 'Thai Iced Coffee', description: 'Strong brew with condensed milk', price: 7.50, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Thai+Iced+Coffee' },
            { id: 'm1-be3', name: 'Fresh Coconut Water', description: 'Chilled coconut water in the shell', price: 9.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Fresh+Coconut+Water' },
            { id: 'm1-be4', name: 'Butterfly Pea Lemonade', description: 'Vibrant blue herbal tea with a squeeze of lime', price: 8.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Butterfly+Pea+Lemonade' },
          ]
        }
      ]
    },
    tenant_breeze_002: {
      name: 'Thai Breeze Express',
      menu: [
        {
          category: 'Quick Bites',
          items: [
            { id: 'm2-q1', name: 'Mini Spring Rolls', description: 'Crispy veg rolls (4pcs)', price: 8.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Mini+Spring+Rolls' },
            { id: 'm2-q2', name: 'Chicken Satay Stick', description: 'Single grilled skew', price: 4.00, spice: 1, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Chicken+Satay+Stick' },
          ]
        },
        {
          category: 'Fast Bowls',
          items: [
            { id: 'm2-b1', name: 'Basil Chicken Bowl', description: 'Minced chicken with holy basil and rice', price: 16.50, spice: 3, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Basil+Chicken+Bowl' },
            { id: 'm2-b2', name: 'Veggie Pad Thai Bowl', description: 'Classic stir-fry noodles with tofu', price: 15.00, spice: 1, isAvailable: true, imageUrl: 'https://placehold.co/400x400.png?text=Veggie+Pad+Thai+Bowl' },
          ]
        }
      ]
    }
  },
  user: {
    id: 'c0a1b2c3-d4e5-4f6g-8h9i-j0k1l2m3n4o5',
    fullName: 'Liam Wilson',
    email: 'liam.wilson@example.com.au',
    phone: '+61 412 345 678',
    loyaltyPoints: 450,
    primaryAddress: '12 George St, Sydney NSW 2000',
  }
};

apiClient.interceptors.request.use(async (config) => {
  const { url, method, headers, params } = config;
  await new Promise(resolve => setTimeout(resolve, 400));

  // Extract tenantId from Header or Query Params
  const tenantId = 
    headers?.['x-tenant-id'] || 
    params?.['tenantId'] || 
    (params && typeof params === 'string' ? qs.parse(params).tenantId : null) || 
    DEFAULT_TENANT_ID;

  if (url === '/menu' && method === 'get') {
    const tenantData = MOCK_DATA.tenants[tenantId] || MOCK_DATA.tenants[DEFAULT_TENANT_ID];
    config.adapter = () => Promise.resolve({ 
      data: tenantData.menu, 
      status: 200, 
      statusText: 'OK', 
      headers: {}, 
      config 
    });
  }
  
  if (url === '/user/profile' && method === 'get') {
    config.adapter = () => Promise.resolve({ data: MOCK_DATA.user, status: 200, statusText: 'OK', headers: {}, config });
  }
  
  if (url === '/payments/stripe' && method === 'post') {
    config.adapter = () => Promise.resolve({ data: { client_secret: 'pi_mock_secret_12345', paymentIntentId: 'pi_123' }, status: 200, statusText: 'OK', headers: {}, config });
  }

  if (url === '/orders/confirm' && method === 'post') {
    config.adapter = () => Promise.resolve({ 
      data: { orderId: 'order_abc123', status: 'confirmed' }, 
      status: 200, 
      statusText: 'OK', 
      headers: {}, 
      config 
    });
  }
  
  return config;
});

export default apiClient;
