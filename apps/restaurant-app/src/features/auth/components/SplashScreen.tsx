import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StoreLogo } from '../../../components/common/StoreLogo';
import { Typography } from '../../../components/common/Typography';
import { login } from '../../../utils/mockAuth';

const SPLASH_DURATION_MS = 1500;

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await login();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
        setTimeout(onComplete, SPLASH_DURATION_MS);
      }
    };

    initializeAuth();
  }, [onComplete]);

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <StoreLogo size={120} className="mb-8" />
      <Typography variant="h2" className="mb-2 text-center">
        Restaurant Manager
      </Typography>
      <Typography variant="body" className="text-zinc-500 text-center mb-6">
        Manage your restaurant with ease
      </Typography>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : (
        <Typography variant="caption" className="text-zinc-400">
          Authenticating...
        </Typography>
      )}
    </View>
  );
};