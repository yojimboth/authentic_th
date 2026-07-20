import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useAuthStore } from '../../../store/useAuthStore';
import { RootStackParamList, OnReturnToCheckout } from '../../../navigation/RootNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type AuthRouteProp = RouteProp<RootStackParamList, 'Auth'>;

/** UI step states for the auth flow. */
type Step = 'email' | 'code' | 'loading' | 'error';

/** Email validation regex (RFC 5322 simplified). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * AuthScreen implements the passwordless email OTP flow:
 * - Step 1: Email entry → request verification code
 * - Step 2: 6-digit code entry → verify → ProfileCreation or Checkout
 */
export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AuthRouteProp>();
  const { requestCode, verifyCode } = useAuthStore();

  const { onReturnToCheckout }: { onReturnToCheckout: OnReturnToCheckout } =
    route.params ?? { onReturnToCheckout: () => navigation.goBack() };

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /** Countdown timer for code resend availability. */
  useEffect(() => {
    if (step === 'code' && resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, resendTimer]);

  /** Format seconds as MM:SS. */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /** Validate email format. */
  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };

  /** Send verification code to email address. */
  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await requestCode(email);

    if ('error' in result) {
      setError(result.error);
      setStep('error');
    } else {
      setStep('code');
      setResendTimer(300);
      setCode('');
    }

    setIsLoading(false);
  };

  /** Verify the 6-digit OTP code entered by the user. */
  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await verifyCode(email, code);

    if ('error' in result) {
      setError(result.error);
      setCode('');
    } else if (result.requiresProfile) {
      navigation.replace('ProfileCreation', { email, onReturnToCheckout });
    } else {
      onReturnToCheckout();
    }

    setIsLoading(false);
  };

  /** Resend the verification code (subject to cooldown). */
  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    const result = await requestCode(email);

    if ('error' in result) {
      setError(result.error);
    } else {
      setError('');
      setCode('');
      setResendTimer(300);
    }

    setIsLoading(false);
  };

  /** Navigate back to email entry step. */
  const handleBackToEmail = () => {
    setStep('email');
    setError('');
    setCode('');
  };

  // ─── Step 1: Email Entry ──────────────────────────────────────

  if (step === 'email') {
    return (
      <View className="flex-1 bg-white p-6">
        <View className="pt-12">
          <Typography variant="h1" className="mb-2">
            Enter Email
          </Typography>
          <Typography variant="body" className="text-zinc-500 mb-8">
            Enter the email address we'll send a code to
          </Typography>

          <View className="mb-4">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="border border-zinc-300 rounded-xl px-4 py-4 text-base"
              editable={!isLoading}
            />
            {error && (
              <Typography variant="caption" className="text-rose-500 mt-2">
                {error}
              </Typography>
            )}
          </View>

          <Button
            title="Send Code"
            variant="primary"
            onPress={handleSendCode}
            loading={isLoading}
            disabled={!email || isLoading}
            className="py-4"
          />

          <TouchableOpacity
            onPress={handleResendCode}
            disabled={resendTimer > 0}
            className="mt-4 items-center"
          >
            <Typography
              variant="body"
              className={resendTimer > 0 ? 'text-zinc-400' : 'text-brand-primary'}
            >
              {resendTimer > 0
                ? `Resend code (${formatTime(resendTimer)})`
                : 'Resend code'}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Step 2: Code Entry ───────────────────────────────────────

  return (
    <View className="flex-1 bg-white p-6">
      <View className="pt-12">
        <TouchableOpacity onPress={handleBackToEmail} className="mb-4">
          <Typography variant="body" className="text-zinc-500">
            ← Back
          </Typography>
        </TouchableOpacity>

        <Typography variant="h1" className="mb-2">
          Verification Code
        </Typography>
        <TouchableOpacity onPress={handleBackToEmail} className="mb-8">
          <Typography variant="body" className="text-zinc-500 text-center">
            We sent a code to {email}{' '}
            <Text className="text-brand-primary">(tap to change)</Text>
          </Typography>
        </TouchableOpacity>

        {/* Visual 6-digit code boxes */}
        <View className="flex-row justify-center mb-8">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                className={`w-12 h-14 border-2 border-zinc-300 rounded-lg items-center justify-center mx-1 ${
                  code.length > i
                    ? 'border-brand-primary bg-brand-primary/10'
                    : ''
                }`}
              >
                {code[i] ? (
                  <Typography variant="h2" className="font-bold">
                    {code[i]}
                  </Typography>
                ) : null}
              </View>
            ))}
        </View>

        {/* Hidden TextInput captures keyboard input */}
        <TextInput
          value={code}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
            setCode(cleaned);
            if (error) setError('');
          }}
          keyboardType="number-pad"
          maxLength={6}
          className="absolute opacity-0"
          testID="code-input"
          autoFocus
        />

        {error && (
          <View className="mb-4">
            <Typography variant="body" className="text-rose-500 text-center">
              {error}
            </Typography>
          </View>
        )}

        <Button
          title="Verify"
          variant="primary"
          onPress={handleVerifyCode}
          loading={isLoading}
          disabled={code.length !== 6 || isLoading}
          className="py-4"
        />

        <TouchableOpacity
          onPress={handleResendCode}
          disabled={resendTimer > 0}
          className="mt-4 items-center"
        >
          <Typography
            variant="body"
            className={resendTimer > 0 ? 'text-zinc-400' : 'text-brand-primary'}
          >
            {resendTimer > 0
              ? `Resend code (${formatTime(resendTimer)})`
              : 'Resend code'}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};