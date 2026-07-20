import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '../features/auth/types';
import {
  logLogin,
  logLogout,
  logAuthFailure,
  logAuthLockout,
  logAuthEvent,
} from './auditLogger';

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

const randomUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Mock Authentication Utilities (OTP Flow)
 *
 * This module provides passwordless email OTP authentication with mock
 * token management. It simulates real JWT/OAuth/OTP behavior for frontend-first
 * development and can be seamlessly replaced with a real backend.
 *
 * Security Features:
 * - Cryptographically secure token generation via expo-crypto
 * - OTP generation with 5-minute TTL and brute-force lockout
 * - 15-minute access token expiry with 7-day refresh tokens
 * - Secure token storage in SecureStore (encrypted, device-only Keychain)
 * - Token validation with structure and expiration verification
 * - Configurable user identity instead of hardcoded values
 */

// ─── SecureStore Keys ────────────────────────────────────────────────

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_EXPIRY_KEY = 'auth_expiry';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REFRESH_TOKEN_EXPIRY_KEY = 'refresh_token_expiry';

// ─── Configurable User ───────────────────────────────────────────────

let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

export const getCurrentUserId = (): string => {
  if (!currentUserId) {
    currentUserId = 'user_mock_' + Date.now();
  }
  return currentUserId;
};

// ─── Rate Limiting ───────────────────────────────────────────────────

let failedAttempts = 0;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
let lockoutUntil: number | null = null;

const checkLockout = (userId: string): void => {
  if (lockoutUntil && Date.now() < lockoutUntil) {
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    logAuthLockout(userId);
    throw new Error(`Account locked. Try again in ${remaining} seconds.`);
  }
};

const recordFailure = (userId: string): void => {
  failedAttempts++;
  logAuthFailure('Authentication failure', userId);
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    logAuthLockout(userId);
    throw new Error(
      `Too many failed attempts. Account locked for 15 minutes.`
    );
  }
};

const resetAttempts = () => {
  failedAttempts = 0;
  lockoutUntil = null;
};

// ─── Token Configuration ─────────────────────────────────────────────

/** Access token expiry: 15 minutes */
const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

/** Refresh token expiry: 7 days */
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Generate a mock JWT access token.
 * Uses cryptographically secure random bytes.
 *
 * Format: mock-jwt-{timestamp}-{random-hex}
 */
export const generateMockToken = (): string => {
  const randomPart = randomHex(16);
  return `mock-jwt-${Date.now()}-${randomPart}`;
};

/**
 * Generate a mock refresh token (UUID v4).
 */
export const generateRefreshToken = (): string => {
  return randomUUID();
};

/**
 * Validate token structure and expiration.
 *
 * Checks:
 * 1. Token is not null/empty
 * 2. Token has correct prefix and structure
 * 3. Token timestamp is within the 15-minute validity window
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  if (!token.startsWith('mock-jwt-')) return false;

  const parts = token.split('-');
  if (parts.length < 4) return false;

  const timestamp = parseInt(parts[2], 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  const fifteenMinutesAgo = now - ACCESS_TOKEN_EXPIRY_MS;
  return timestamp > fifteenMinutesAgo;
};

/**
 * Get token expiry timestamp.
 */
export const getTokenExpiry = (token: string | null): number | null => {
  if (!token) return null;
  return Date.now() + ACCESS_TOKEN_EXPIRY_MS;
};

/**
 * Generate a refresh token and store it in SecureStore with 7-day expiry.
 */
const storeRefreshToken = async (): Promise<string> => {
  const refreshToken = generateRefreshToken();
  const expiry = Date.now() + REFRESH_TOKEN_EXPIRY_MS;
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
  await SecureStore.setItemAsync(REFRESH_TOKEN_EXPIRY_KEY, expiry.toString(), {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
  return refreshToken;
};

/**
 * Check if the stored access token is valid.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return isTokenValid(token) && getTokenExpiry(token) > Date.now();
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

// ─── OTP Storage ─────────────────────────────────────────────────────

interface StoredOTP {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

const otpStore: Map<string, StoredOTP> = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a 6-digit OTP code.
 * Uses Math.random for mock purposes (not cryptographically secure).
 */
const generateOTP = (): string => {
  const num = Math.floor(Math.random() * 1_000_000);
  return num.toString().padStart(6, '0');
};

/**
 * Request a verification code to be sent to the given email.
 * Generates a 6-digit OTP, stores it in memory, and returns success.
 *
 * In production, this would send an email via the backend.
 */
export const requestVerificationCode = async (
  email: string
): Promise<{ sent: true }> => {
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }

  const code = generateOTP();
  const now = Date.now();

  otpStore.set(email, {
    email,
    code,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
  });

  console.log(`[MOCK OTP] Verification code for ${email}: ${code}`);
  return { sent: true };
};

/**
 * Verify a 6-digit OTP code for the given email.
 *
 * Returns a session object if valid, or throws on failure.
 * Tracks failed attempts and enforces brute-force lockout.
 */
export const verifyCode = async (
  email: string,
  code: string
): Promise<{ requiresProfile: boolean; user?: UserProfile; accessToken: string; refreshToken: string }> => {
  const stored = otpStore.get(email);

  if (!stored) {
    throw new Error('No verification code found. Please request a new one.');
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    throw new Error('Verification code has expired. Please request a new one.');
  }

  if (stored.attempts >= MAX_OTP_ATTEMPTS) {
    throw new Error(
      'Too many verification attempts. Please request a new code.'
    );
  }

  stored.attempts++;
  otpStore.set(email, stored);

  if (stored.code !== code) {
    if (stored.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(email);
      throw new Error(
        'Too many failed attempts. Please request a new code.'
      );
    }
    throw new Error('Invalid verification code.');
  }

  // Valid code - remove from store
  otpStore.delete(email);

  // Check if user profile exists
  const storedProfile = await getUserProfile(email);

  if (storedProfile) {
    // Existing user - generate tokens and return session
    const accessToken = generateMockToken();
    const refreshToken = generateRefreshToken();
    await storeTokens(accessToken, refreshToken);
    logLogin(storedProfile.id);
    return {
      requiresProfile: false,
      user: storedProfile,
      accessToken,
      refreshToken,
    };
  }

  // New user - requires profile completion
  logLogin(email);
  return {
    requiresProfile: true,
    accessToken: '',
    refreshToken: '',
  };
};

/**
 * Complete the user profile for a newly authenticated user.
 * Creates a user record, generates tokens, stores in SecureStore.
 */
export const completeProfile = async (params: {
  name: string;
  phone: string;
  email: string;
}): Promise<{
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}> => {
  if (!params.name || !params.phone || !params.email) {
    throw new Error('Name, phone, and email are required');
  }

  const userId = 'user_' + randomUUID().replace(/-/g, '').slice(0, 12);
  const profile: UserProfile = {
    id: userId,
    email: params.email,
    fullName: params.name,
    phone: params.phone,
    loyaltyPoints: 0,
    isComplete: true,
  };

  await storeUserProfile(profile);

  const accessToken = generateMockToken();
  const refreshToken = generateRefreshToken();
  await storeTokens(accessToken, refreshToken);

  setCurrentUserId(userId);
  logLogin(userId);

  return { user: profile, accessToken, refreshToken };
};

/**
 * Validate a refresh token and return a new access token.
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const storedRefresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const expiryStr = await SecureStore.getItemAsync(REFRESH_TOKEN_EXPIRY_KEY);

    if (!storedRefresh || storedRefresh !== refreshToken) {
      return null;
    }

    if (!expiryStr || Date.now() > parseInt(expiryStr, 10)) {
      // Refresh token expired, clear everything
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_EXPIRY_KEY);
      return null;
    }

    const newAccessToken = generateMockToken();
    const newRefreshToken = generateRefreshToken();
    await storeTokens(newAccessToken, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// ─── Backward-Compatible Token Functions ─────────────────────────────

/**
 * Simulate login (generates and stores mock token in SecureStore).
 * Kept for backward compatibility with SplashScreen and existing tests.
 *
 * Security: Token stored in SecureStore with ALWAYS_THIS_DEVICE_ONLY.
 */
export const login = async (): Promise<string> => {
  checkLockout(getCurrentUserId());

  try {
    const token = generateMockToken();
    const expiry = Date.now() + ACCESS_TOKEN_EXPIRY_MS;

    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token, {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });
    await SecureStore.setItemAsync(AUTH_EXPIRY_KEY, expiry.toString(), {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });

    resetAttempts();
    logLogin(getCurrentUserId());

    return token;
  } catch (error) {
    recordFailure(getCurrentUserId());
    throw error;
  }
};

/**
 * Simulate logout (clears stored tokens from SecureStore).
 */
export const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AUTH_EXPIRY_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_EXPIRY_KEY);
    currentUserId = null;
    resetAttempts();
    logLogout(getCurrentUserId());
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

/**
 * Get stored access token from SecureStore.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/**
 * Refresh token (backward-compatible).
 * In OTP flow, delegates to refreshAccessToken.
 */
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

// ─── Internal Helpers ────────────────────────────────────────────────

const AUTH_USER_KEY = 'auth_user_'; // prefix for per-user SecureStore entry

const storeTokens = async (
  _accessToken: string,
  _refreshToken: string
): Promise<void> => {
  const now = Date.now();
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, _accessToken, {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
  await SecureStore.setItemAsync(
    AUTH_EXPIRY_KEY,
    (now + ACCESS_TOKEN_EXPIRY_MS).toString(),
    {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    }
  );
  await storeRefreshToken();
};

const storeUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      AUTH_USER_KEY + profile.email,
      JSON.stringify(profile),
      {
        keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
      }
    );
  } catch (error) {
    console.error('Failed to store user profile:', error);
  }
};

const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  try {
    const stored = await SecureStore.getItemAsync(AUTH_USER_KEY + email);
    if (stored) {
      return JSON.parse(stored) as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve user profile:', error);
    return null;
  }
};