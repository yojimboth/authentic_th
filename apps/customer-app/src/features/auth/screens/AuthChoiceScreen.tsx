import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreLogo } from '../../../components/common/StoreLogo';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { currentConfig } from '../../../config/whiteLabelConfig';
import { useAuthStore } from '../../../store/useAuthStore';
import { RootStackParamList, OnReturnToCheckout } from '../../../navigation/RootNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type AuthChoiceRouteProp = RouteProp<RootStackParamList, 'AuthChoice'>;

/**
 * AuthChoiceScreen presents the user with two options:
 * continue as a guest (→ CheckoutScreen) or become a member (→ AuthScreen).
 *
 * This screen is only reached from the Checkout flow, never at app launch.
 */
export const AuthChoiceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AuthChoiceRouteProp>();
  const { setGuest } = useAuthStore();

  const { onReturnToCheckout }: { onReturnToCheckout: OnReturnToCheckout } =
    route.params ?? { onReturnToCheckout: () => navigation.goBack() };

  /** Navigate to checkout screen, replacing this screen on the stack. */
  const handleGuestCheckout = () => {
    setGuest();
    onReturnToCheckout();
  };

  /** Navigate to the email OTP auth flow. */
  const handleBecomeMember = () => {
    navigation.navigate('Auth', { onReturnToCheckout });
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <StoreLogo
        logoSource={currentConfig.logoSource}
        size={120}
        className="mb-8"
      />
      <Typography variant="h2" className="mb-2 text-center font-poppins">
        {currentConfig.restaurantName}
      </Typography>
      <Typography variant="body" className="text-zinc-500 text-center mb-10">
        {currentConfig.slogan}
      </Typography>

      <View className="w-full space-y-4">
        <Button
          title="Continue as Guest"
          variant="secondary"
          onPress={handleGuestCheckout}
          className="py-4"
        />
        <Button
          title="Become a Member"
          variant="primary"
          onPress={handleBecomeMember}
          className="py-4"
        />
      </View>

      <Typography variant="caption" className="text-zinc-400 mt-8 text-center">
        Member benefits: Earn loyalty points on every order
      </Typography>
    </View>
  );
};