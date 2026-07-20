import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StoreLogo } from '../../../components/common/StoreLogo';
import { Typography } from '../../../components/common/Typography';
import { currentConfig } from '../../../config/whiteLabelConfig';

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
 * No authentication logic runs here — the RootNavigator handles
 * auth initialization before rendering this screen.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
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
      <ActivityIndicator size="large" color={currentConfig.theme.primaryColor} />
    </View>
  );
};
