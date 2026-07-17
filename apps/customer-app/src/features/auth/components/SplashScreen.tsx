import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StoreLogo } from '../../../components/common/StoreLogo';
import { Typography } from '../../../components/common/Typography';
import { currentConfig } from '../../../config/whiteLabelConfig';
import { login } from '../../../utils/mockAuth';

const SPLASH_DURATION_MS = 1500;

interface SplashScreenProps {
  /** Called once the splash's minimum display time has elapsed. */
  onComplete: () => void;
}

/**
 * Branded intro screen shown briefly on cold start, before the tab
 * navigator mounts. Renders the current white-label tenant's logo and
 * slogan so the two build variants (Siam Authentic / Thai Breeze
 * Express) each show correct branding immediately.
 * 
 * Security: Generates and stores mock authentication token during splash.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Security: Generate mock authentication token during splash
        // This simulates real OAuth/JWT flow for testing
        await login();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
        setTimeout(onComplete, SPLASH_DURATION_MS);
      }
    };

    initializeAuth();
    return () => {};
  }, [onComplete]);

  return (
    <View
      className="flex-1 items-center justify-center p-6"
      style={{ backgroundColor: currentConfig.theme.backgroundColor }}
    >
      <StoreLogo logoSource={currentConfig.logoSource} size={120} className="mb-8" />
      <Typography variant="h2" className="mb-2 text-center">
        {currentConfig.restaurantName}
      </Typography>
      <Typography variant="body" className="text-zinc-500 text-center mb-6">
        {currentConfig.slogan}
      </Typography>
      {isLoading ? (
        <ActivityIndicator size="large" color={currentConfig.theme.primaryColor} />
      ) : (
        <Typography variant="caption" className="text-zinc-400">
          Authenticating...
        </Typography>
      )}
    </View>
  );
};
