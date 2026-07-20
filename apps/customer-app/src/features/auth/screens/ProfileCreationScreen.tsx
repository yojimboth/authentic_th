import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useAuthStore } from '../../../store/useAuthStore';
import { RootStackParamList, OnReturnToCheckout } from '../../../navigation/RootNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type ProfileRouteProp = RouteProp<RootStackParamList, 'ProfileCreation'>;

/**
 * ProfileCreationScreen collects name and phone from a newly authenticated
 * user before proceeding to checkout.
 */
export const ProfileCreationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProfileRouteProp>();
  const { completeProfile } = useAuthStore();

  const { email, onReturnToCheckout }: { email: string; onReturnToCheckout: OnReturnToCheckout } =
    (route.params ?? { email: '', onReturnToCheckout: () => navigation.goBack() }) as {
      email: string;
      onReturnToCheckout: OnReturnToCheckout;
    };

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /** Validate full name length. */
  const validateName = (name: string): boolean => {
    return name.length >= 2 && name.length <= 60;
  };

  /** Validate Australian mobile phone: 04XX XXX XXX (10 digits starting with 04). */
  const validatePhone = (phone: string): boolean => {
    const regex = /^04\d{8}$/;
    return regex.test(phone);
  };

  /** Format phone number as 04XX XXX XXX. */
  const formatPhone = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
  };

  /** Submit the completed profile to the auth store and return to checkout. */
  const handleContinue = async () => {
    if (!validateName(fullName)) {
      setError('Name must be 2-60 characters');
      return;
    }

    if (!validatePhone(phone.replace(/\s/g, ''))) {
      setError('Please enter a valid Australian phone number (04XX XXX XXX)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await completeProfile({
        name: fullName,
        phone: phone.replace(/\s/g, ''),
        email,
      });

      onReturnToCheckout();
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    }

    setIsLoading(false);
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="pt-12">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mb-4"
        >
          <Typography variant="body" className="text-zinc-500">
            ← Back
          </Typography>
        </TouchableOpacity>

        <Typography variant="h1" className="mb-2">
          Welcome!
        </Typography>
        <Typography variant="body" className="text-zinc-500 mb-8">
          Set up your profile to start earning points
        </Typography>

        <View className="mb-6">
          <Typography variant="body" className="text-zinc-700 mb-2">
            Full Name
          </Typography>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Liam Wilson"
            autoCapitalize="words"
            className="border border-zinc-300 rounded-xl px-4 py-4 text-base"
            editable={!isLoading}
          />
        </View>

        <View className="mb-6">
          <Typography variant="body" className="text-zinc-700 mb-2">
            Phone Number
          </Typography>
          <TextInput
            value={phone}
            onChangeText={(text) => setPhone(formatPhone(text))}
            placeholder="0412 345 678"
            keyboardType="phone-pad"
            className="border border-zinc-300 rounded-xl px-4 py-4 text-base"
            editable={!isLoading}
          />
          <Typography variant="caption" className="text-zinc-400 mt-2">
            Format: 04XX XXX XXX
          </Typography>
        </View>

        {error && (
          <View className="mb-4">
            <Typography variant="body" className="text-rose-500">
              {error}
            </Typography>
          </View>
        )}

        <Button
          title="Continue"
          variant="primary"
          onPress={handleContinue}
          loading={isLoading}
          disabled={!fullName || !phone || isLoading}
          className="py-4"
        />
      </View>
    </View>
  );
};