import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { StoreLogo } from '../../../components/common/StoreLogo';
import { Typography } from '../../../components/common/Typography';
import { TextInput } from '../../../components/common/TextInput';
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../auth/hooks/useAuth';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let valid = true;
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const result = await login();
    if (result.success) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <TouchableOpacity onPress={() => navigation.goBack()} className="py-2 mb-4">
        <Text className="text-brand-primary text-base font-semibold">← Back</Text>
      </TouchableOpacity>

      <View className="items-center mb-8">
        <StoreLogo size={80} className="mb-4" />
        <Typography variant="h2" className="text-center mb-1">
          Restaurant Login
        </Typography>
        <Typography variant="body" className="text-center text-zinc-500">
          Sign in to manage your store
        </Typography>
      </View>

      <View className="flex-1">
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => { setEmail(text); setEmailError(''); }}
          error={emailError || undefined}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
          error={passwordError || undefined}
          placeholder="Enter password"
          secureTextEntry
          autoComplete="password"
        />

        {error && (
          <View className="bg-red-50 rounded-lg p-3 mb-4">
            <Text className="text-red-600 text-sm text-center">{error}</Text>
          </View>
        )}

        <View className="mt-4">
          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            className="w-full"
          />
        </View>

        <View className="items-center mt-4">
          <TouchableOpacity>
            <Text className="text-brand-primary text-sm">Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};