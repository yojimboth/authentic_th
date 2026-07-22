import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { StoreLogo } from '../../../components/common/StoreLogo';

const SPLASH_DURATION_MS = 1500;

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Wait minimum 1.5 seconds before transitioning to Login
    const timer = setTimeout(onComplete, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <StoreLogo size={120} style={styles.logo} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Restaurant Manager</Text>
        <Text style={styles.subtitle}>
          Manage your restaurant with ease
        </Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    marginBottom: 32,
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    alignItems: 'center',
  },
});