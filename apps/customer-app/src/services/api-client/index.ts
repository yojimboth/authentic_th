// Mock API Client with passwordless email OTP auth endpoints
//
// This module provides an in-memory mock API client for frontend-first
// development. All auth and user endpoints are simulated with hardcoded data.
// Replace with real HTTP client (Axios/fetch) when backend is ready.

import { MenuCategory } from '../../features/menu/types';

// ─── Token Storage Keys ──────────────────────────────────────────────

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ─── In-Memory Mock Data ─────────────────────────────────────────────

const mockUsers = [
  {
    id: 'user_001',
    email: 'test@example.com',
    fullName: 'Test User',
    phone: '0412345678',
    loyaltyPoints: 100,
    isComplete: true,
  },
];

// ─── Mock OTP Store ──────────────────────────────────────────────────

interface StoredOTP {
  code: string;
  expiresAt: number;
}

const otpStore = new Map<string, StoredOTP>();

// ─── Generators ──────────────────────────────────────────────────────

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (): string => {
  return `mock_token_${Date.now()}`;
};

const generateRefreshToken = (): string => {
  return `mock_refresh_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

// ─── API Client Class ────────────────────────────────────────────────

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string, _options?: any) {
    if (endpoint === '/me') {
      return this.handleMe();
    }
    if (endpoint === '/user/profile') {
      return { data: mockUsers[0] };
    }
    if (endpoint === '/menu') {
      return this.handleMenu();
    }

    // Fallback: log and return empty data
    console.log(`[API Client] GET ${endpoint}`);
    return { data: {} };
  }

  async post(endpoint: string, data?: any) {
    if (endpoint === '/auth/request-code') {
      return this.handleRequestCode(data?.email);
    }
    if (endpoint === '/auth/verify-code') {
      return this.handleVerifyCode(data?.email, data?.code);
    }
    if (endpoint === '/auth/complete-profile') {
      return this.handleCompleteProfile(data);
    }
    if (endpoint === '/auth/refresh') {
      return this.handleRefresh(data?.refresh_token);
    }
    if (endpoint === '/auth/logout') {
      return this.handleLogout();
    }
    if (endpoint === '/payments/stripe') {
      return { data: { client_secret: 'pk_mock_123', calculatedAmount: 25.0 } };
    }
    if (endpoint === '/orders/confirm') {
      return { data: { orderId: `order_${Date.now()}` } };
    }

    // Fallback: log and return empty data
    console.log(`[API Client] POST ${endpoint}`);
    return { data: {} };
  }

  async patch(endpoint: string, _data?: any) {
    if (endpoint === '/user/profile') {
      console.log('[API Client] PATCH /user/profile (mock)');
      return { data: { success: true } };
    }

    console.log(`[API Client] PATCH ${endpoint}`);
    return { data: {} };
  }

  private handleMe() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error('Not authenticated');
    }
    return { data: mockUsers[0] };
  }

  private handleRequestCode(email: string) {
    const code = generateOTP();
    otpStore.set(email, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    console.log(`[API Client] OTP sent to ${email}: ${code}`);
    return { data: { sent: true, email, codeExpiresIn: 300 } };
  }

  private handleVerifyCode(email: string, code: string) {
    const otp = otpStore.get(email);
    if (!otp) {
      return { data: { valid: false, error: 'No code requested' } };
    }
    if (otp.expiresAt < Date.now()) {
      otpStore.delete(email);
      return { data: { valid: false, error: 'Code expired' } };
    }
    if (otp.code !== code) {
      return { data: { valid: false, error: 'Invalid code' } };
    }

    const user = mockUsers.find((u) => u.email === email) || {
      id: `user_${Date.now()}`,
      email,
      fullName: '',
      phone: '',
      loyaltyPoints: 0,
      isComplete: false,
    };

    const requiresProfile = !user.isComplete;

    if (!requiresProfile) {
      const token = generateToken();
      const refreshToken = generateRefreshToken();
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    return { data: { valid: true, requiresProfile, user } };
  }

  private handleCompleteProfile(data: any) {
    const { name, phone, email } = data;

    const user = {
      id: `user_${Date.now()}`,
      email,
      fullName: name,
      phone,
      loyaltyPoints: 0,
      isComplete: true,
    };

    const token = generateToken();
    const refreshToken = generateRefreshToken();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    return { data: { user, accessToken: token, refreshToken } };
  }

  private handleRefresh(refreshToken: string | undefined) {
    if (!refreshToken || !refreshToken.startsWith('mock_refresh_')) {
      return { data: { error: 'Invalid refresh token' } };
    }

    const newToken = generateToken();
    localStorage.setItem(TOKEN_KEY, newToken);

    return { data: { access_token: newToken } };
  }

  private handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    otpStore.clear();
    return { data: { success: true } };
  }

  private handleMenu(): { data: MenuCategory[] } {
    const menuData: MenuCategory[] = [
      {
        category: 'Appetizers',
        items: [
          {
            id: 'appetizer_1',
            name: 'Spring Rolls',
            description: 'Crispy vegetable spring rolls with sweet chili sauce',
            price: 8.90,
            spice: 0,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/FEF3C7/92400E?text=Spring+Rolls',
          },
          {
            id: 'appetizer_2',
            name: 'Satay Chicken Skewers',
            description: 'Grilled chicken with peanut sauce and cucumber relish',
            price: 12.50,
            spice: 1,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/FFE4E6/9F1239?text=Satay',
          },
          {
            id: 'appetizer_3',
            name: 'Thai Meatballs',
            description: 'Herb-infused meatballs with sweet and sour sauce',
            price: 10.90,
            spice: 1,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/FEF9C3/854D0E?text=Meatballs',
          },
        ],
      },
      {
        category: 'Curries',
        items: [
          {
            id: 'curry_1',
            name: 'Green Curry',
            description: 'Traditional green curry with coconut milk and vegetables',
            price: 16.90,
            spice: 2,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/DCfce7/166534?text=Green+Curry',
          },
          {
            id: 'curry_2',
            name: 'Red Curry',
            description: 'Spicy red curry with bamboo shoots and basil',
            price: 16.90,
            spice: 3,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fee2e2/991b1b?text=Red+Curry',
          },
          {
            id: 'curry_3',
            name: 'Massaman Curry',
            description: 'Mild curry with potatoes, peanuts, and beef',
            price: 18.50,
            spice: 1,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fed7aa/9a3412?text=Massaman',
          },
          {
            id: 'curry_4',
            name: 'Panang Curry',
            description: 'Thick, sweet curry with kaffir lime leaves',
            price: 17.50,
            spice: 2,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fef3c7/92400e?text=Panang',
          },
        ],
      },
      {
        category: 'Noodles & Rice',
        items: [
          {
            id: 'noodle_1',
            name: 'Pad Thai',
            description: 'Stir-fried rice noodles with tamarind sauce, peanuts, and prawns',
            price: 15.90,
            spice: 1,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fef9c3/854d0e?text=Pad+Thai',
          },
          {
            id: 'noodle_2',
            name: 'Drunken Noodles',
            description: 'Wide rice noodles with basil, chili, and vegetables',
            price: 15.50,
            spice: 2,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fef3c7/92400e?text=Drunken+Noodles',
          },
          {
            id: 'rice_1',
            name: 'Pad Kra Pao',
            description: 'Minced pork with holy basil and fried egg',
            price: 14.90,
            spice: 2,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/ffedd5/9a3412?text=Pad+Kra+Pao',
          },
          {
            id: 'rice_2',
            name: 'Thai Fried Rice',
            description: 'Jasmine rice with egg, onion, and your choice of protein',
            price: 14.50,
            spice: 0,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fef3c7/92400e?text=Fried+Rice',
          },
        ],
      },
      {
        category: 'Soups',
        items: [
          {
            id: 'soup_1',
            name: 'Tom Yum Goong',
            description: 'Hot and sour soup with prawns, lemongrass, and galangal',
            price: 13.90,
            spice: 3,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/dbfeff/1e40af?text=Tom+Yum',
          },
          {
            id: 'soup_2',
            name: 'Tom Kha Gai',
            description: 'Coconut chicken soup with galangal and lime leaves',
            price: 13.50,
            spice: 1,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/e0f2fe/0c4a6e?text=Tom+Kha',
          },
        ],
      },
      {
        category: 'Desserts',
        items: [
          {
            id: 'dessert_1',
            name: 'Mango Sticky Rice',
            description: 'Sweet sticky rice with fresh mango and coconut cream',
            price: 9.90,
            spice: 0,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fce7f3/9d174d?text=Mango+Rice',
          },
          {
            id: 'dessert_2',
            name: 'Banana Fritters',
            description: 'Crispy banana in coconut batter with ice cream',
            price: 8.50,
            spice: 0,
            isAvailable: true,
            imageUrl: 'https://placehold.co/400x400/fef9c3/854d0e?text=Banana+Fritters',
          },
        ],
      },
    ];

    return { data: menuData };
  }
}

// ─── Default Export (Backward Compatibility) ─────────────────────────

const apiClient = new ApiClient();
export default apiClient;