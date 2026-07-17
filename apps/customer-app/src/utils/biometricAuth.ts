import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

/**
 * Biometric Authentication Utility
 * Supports Face ID (iOS) and Finger Print (Android)
 *
 * SECURITY: Biometric tokens are stored in the device Keychain/Keystore
 * with ALWAYS_THIS_DEVICE_ONLY accessibility to prevent cross-device access.
 */

export const hasBiometricSupport = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  const supported = await hasBiometricSupport();
  if (!supported) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access Authentic Th',
    fallbackLabel: 'Use Passcode',
    cancelLabel: 'Cancel',
    disableDeviceFallback: true,
  });

  return result.success;
};

export const storeBiometricToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync('biometric_token', token, {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
};

export const getBiometricToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('biometric_token');
};