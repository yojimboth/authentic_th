import axios from 'axios';

/**
 * Mock-Double API Client
 * This client implements the real API interfaces defined in the SDD,
 * but intercepts requests to return mock data from specifications/mocks/mock_data.md.
 */

const API_BASE_URL = 'https://api.authentic-th.com.au/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// --- MOCK DATA (Extracted from mock_data.md) ---
const MOCK_DATA = {
  menu: [
    {
      category: 'Promotion',
      items: [
        { id: 'm1-p1', name: 'Lunch Special Bundle', description: 'Green Curry + Jasmine Rice + Thai Iced Tea', price: 22.50, spice: 2, isAvailable: true, imageUrl: 'https://placehold.co/400x300?text=Lunch+Special+Bundle' },
        { id: 'm1-p2', name: 'Family Feast Pack', description: '3 Mains, 2 Entrees, Large Mixed Rice', price: 85.00, spice: 2, isAvailable: true, imageUrl: 'https://placehold.co/400x300?text=Family+Feast+Pack' },
      ]
    },
    {
      category: 'Entree',
      items: [
        { id: 'm1-e1', name: 'Chicken Satay', description: 'Grilled skewers with peanut sauce', price: 12.00, spice: 1, isAvailable: true, imageUrl: 'https://placehold.co/400x300?text=Chicken+Satay' },
        { id: 'm1-e2', name: 'Pork Spring Rolls', description: 'Hand-rolled vegetables and minced pork', price: 10.00, spice: 0, isAvailable: true, imageUrl: 'https://placehold.co/400x300?text=Pork+Spring+Rolls' },
      ]
    },
    {
      category: 'Curries',
      items: [
        { id: 'm1-c1', name: 'Green Curry', description: 'Spicy coconut curry with bamboo shoots', price: 21.00, spice: 3, isAvailable: true, imageUrl: 'https://placehold.co/400x300?text=Green+Curry' },
        { id: 'm1-c4', name: 'Massaman Curry', description: 'Mild potato and peanut curry (slow cooked)', price: 23.00, spice: 1, isAvailable: true, imageUrl: 'https://placehold.co/400x300?text=Massaman+Curry' },
      ]
    }
  ],
  user: {
    id: 'c0a1b2c3-d4e5-4f6g-8h9i-j0k1l2m3n4o5',
    fullName: 'Liam Wilson',
    email: 'liam.wilson@example.com.au',
    phone: '+61 412 345 678',
    loyaltyPoints: 450,
    primaryAddress: '12 George St, Sydney NSW 2000',
  }
};

// --- INTERCEPTOR (The "Mock-Double" Logic) ---
apiClient.interceptors.request.use(async (config) => {
  const { url, method } = config;

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  // Route: GET /api/menu
  if (url === '/menu' && method === 'get') {
    config.adapter = () => Promise.resolve({
      data: MOCK_DATA.menu,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Route: GET /api/user/profile
  if (url === '/user/profile' && method === 'get') {
    config.adapter = () => Promise.resolve({
      data: MOCK_DATA.user,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Route: POST /api/payments/stripe
  if (url === '/payments/stripe' && method === 'post') {
    config.adapter = () => Promise.resolve({
      data: { client_secret: 'pi_mock_secret_12345', paymentIntentId: 'pi_123' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  return config;
});

export default apiClient;
