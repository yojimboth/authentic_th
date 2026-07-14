/**
 * White-Label Configuration System
 * 
 * This file centralizes all restaurant-specific branding and identifiers.
 * In a production build, these values can be injected via environment variables
 * or separate config files per restaurant.
 */

export interface WhiteLabelConfig {
  restaurantName: string;
  tenantId: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    borderColor: string;
    activeTintColor: string;
    inactiveTintColor: string;
  };
}

export const RESTAURANT_CONFIGS: Record<string, WhiteLabelConfig> = {
  restaurant_a: {
    restaurantName: 'Siam Authentic',
    tenantId: 'tenant_siam_001',
    theme: {
      primaryColor: '#FF6B00',
      secondaryColor: '#FFA500',
      backgroundColor: '#ffffff',
      borderColor: '#e4e4e7',
      activeTintColor: '#FF6B00',
      inactiveTintColor: '#71717a',
    },
  },
  restaurant_b: {
    restaurantName: 'Thai Breeze Express',
    tenantId: 'tenant_breeze_002',
    theme: {
      primaryColor: '#00A86B',
      secondaryColor: '#3CB371',
      backgroundColor: '#ffffff',
      borderColor: '#e4e4e7',
      activeTintColor: '#00A86B',
      inactiveTintColor: '#71717a',
    },
  },
};

// Determine current restaurant from environment variable, defaulting to restaurant_a
const currentVariant = process.env.APP_VARIANT || 'restaurant_a';
export const currentConfig = RESTAURANT_CONFIGS[currentVariant] || RESTAURANT_CONFIGS.restaurant_a;
