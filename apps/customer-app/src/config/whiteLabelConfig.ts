import Constants from 'expo-constants';
import { ImageSourcePropType } from 'react-native';

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
  slogan: string;
  /** Static require() result for the restaurant's logo, used by StoreLogo. */
  logoSource: ImageSourcePropType;
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
  siam_authentic: {
    restaurantName: 'Siam Authentic',
    tenantId: 'tenant_siam_001',
    slogan: 'Experience the true taste of Thailand',
    logoSource: require('../assets/mocks/logos/siam_authentic.png'),
    theme: {
      primaryColor: '#FF6B00',
      secondaryColor: '#FFA500',
      backgroundColor: '#ffffff',
      borderColor: '#e4e4e7',
      activeTintColor: '#FF6B00',
      inactiveTintColor: '#71717a',
    },
  },
  thai_breeze: {
    restaurantName: 'Thai Breeze Express',
    tenantId: 'tenant_breeze_002',
    slogan: 'Thai flavors, delivered fast',
    logoSource: require('../assets/mocks/logos/thai_breeze_logo.png'),
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

// Determine current restaurant from Expo config extra, defaulting to siam_authentic
const currentVariant = Constants.expoConfig?.extra?.appVariant || 'siam_authentic';
const resolvedConfig = RESTAURANT_CONFIGS[currentVariant] || null;

// Validate tenant configuration exists to prevent running with missing tenant ID
if (!resolvedConfig) {
  console.error(
    'FATAL: No valid tenant configuration found for variant:',
    currentVariant,
    '. Available variants:',
    Object.keys(RESTAURANT_CONFIGS).join(', '),
  );
  throw new Error('Missing tenant configuration');
}

export const currentConfig = resolvedConfig;
