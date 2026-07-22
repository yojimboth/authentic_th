import * as SecureStore from 'expo-secure-store';

/**
 * Native-free random generators (replaces expo-crypto).
 * These are sufficient for mock/auth testing purposes.
 */
const randomHex = (bytes: number): string => {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < bytes; i++) {
    result += chars[Math.floor(Math.random() * 16)];
  }
  return result;
};

const AUTH_TOKEN_KEY = 'restaurant_auth_token';

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

let failedAttempts = 0;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
let lockoutUntil: number | null = null;

export const generateMockToken = (): string => {
  const randomPart = randomHex(16);
  return `mock-jwt-${Date.now()}-${randomPart}`;
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  if (!token.startsWith('mock-jwt-')) return false;
  const parts = token.split('-');
  if (parts.length < 4) return false;
  const timestamp = parseInt(parts[2], 10);
  if (isNaN(timestamp)) return false;
  const now = Date.now();
  const twentyFourHoursAgo = now - TOKEN_EXPIRY_MS;
  return timestamp > twentyFourHoursAgo;
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return isTokenValid(token) && (Date.now() + TOKEN_EXPIRY_MS) > Date.now();
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

export const login = async (): Promise<string> => {
  if (lockoutUntil && Date.now() < lockoutUntil) {
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    throw new Error(`Account locked. Try again in ${remaining} seconds.`);
  }

  try {
    const token = generateMockToken();
    const expiry = Date.now() + TOKEN_EXPIRY_MS;

    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token, {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });
    await SecureStore.setItemAsync(`${AUTH_TOKEN_KEY}_expiry`, expiry.toString(), {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });

    failedAttempts = 0;
    lockoutUntil = null;

    return token;
  } catch (error) {
    failedAttempts++;
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      throw new Error(`Too many failed attempts. Account locked for 15 minutes.`);
    }
    throw new Error('Authentication failed');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(`${AUTH_TOKEN_KEY}_expiry`);
    failedAttempts = 0;
    lockoutUntil = null;
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = await getToken();
    if (token && isTokenValid(token)) {
      return token;
    }
    return await login();
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};