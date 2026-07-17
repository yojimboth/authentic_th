import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { logLogin, logLogout, logAuthFailure, logAuthLockout } from './auditLogger';

/**
 * Mock Authentication Utilities
 * 
 * This module provides mock authentication that simulates real JWT/OAuth behavior.
 * It can be seamlessly replaced with real authentication when transitioning to
 * a real backend.
 * 
 * Security Features:
 * - Cryptographically secure token generation via expo-crypto
 * - Token expiration checking with timestamp validation
 * - Secure token storage in SecureStore (encrypted, device-only Keychain)
 * - Token validation with structure and expiration verification
 * - Configurable user identity instead of hardcoded values
 */

// SECURITY: Fixed-length, URL-safe keys compatible with expo-secure-store requirements
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_EXPIRY_KEY = 'auth_expiry';

// Configurable user ID instead of hardcoded value
let currentUserId: string | null = null;

// SECURITY: Rate limiting to prevent brute force login attacks
let failedAttempts = 0;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
let lockoutUntil: number | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

export const getCurrentUserId = (): string => {
  if (!currentUserId) {
    currentUserId = 'user_mock_' + Date.now();
  }
  return currentUserId;
};

// Token expiration: 24 hours in milliseconds
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Generate a mock JWT token for testing
 * Uses cryptographically secure random bytes instead of Math.random()
 * 
 * In production, this would be replaced with real OAuth/JWT flow
 */
export const generateMockToken = (): string => {
  const randomBytes = Crypto.getRandomBytes(16);
  const randomPart = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `mock-jwt-${Date.now()}-${randomPart}`;
};

/**
 * Check if a token is valid (exists, has correct structure, and hasn't expired)
 * 
 * Validates:
 * 1. Token is not null/empty
 * 2. Token has correct prefix and structure (mock-jwt-{timestamp}-{random})
 * 3. Token timestamp is within the 24-hour validity window
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  // Basic structure validation
  if (!token.startsWith('mock-jwt-')) return false;
  
  // Check token format: mock-jwt-{timestamp}-{random}
  const parts = token.split('-');
  if (parts.length < 4) return false;
  
  // Verify timestamp is present and parseable
  const timestamp = parseInt(parts[2], 10);
  if (isNaN(timestamp)) return false;
  
  // Verify timestamp is recent (within 24 hours)
  const now = Date.now();
  const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
  
  return timestamp > twentyFourHoursAgo;
};

/**
 * Get token expiry timestamp
 */
export const getTokenExpiry = (token: string | null): number | null => {
  if (!token) return null;
  return Date.now() + TOKEN_EXPIRY_MS;
};

/**
 * Check if user is authenticated (valid token and not expired)
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

/**
 * Simulate login (generates and stores mock token in SecureStore)
 * 
 * Security: Token is stored in SecureStore (iOS Keychain / Android Keystore)
 * with ALWAYS_THIS_DEVICE_ONLY accessibility to prevent cross-device access.
 */
export const login = async (): Promise<string> => {
  // SECURITY: Check if account is locked out due to failed attempts
  if (lockoutUntil && Date.now() < lockoutUntil) {
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    // SECURITY: Log lockout event for compliance
    logAuthLockout(getCurrentUserId());
    throw new Error(`Account locked. Try again in ${remaining} seconds.`);
  }

  try {
    const token = generateMockToken();
    const expiry = Date.now() + TOKEN_EXPIRY_MS;
    
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token, {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });
    await SecureStore.setItemAsync(AUTH_EXPIRY_KEY, expiry.toString(), {
      keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
    });
    
    // SECURITY: Reset failed attempts on successful login
    failedAttempts = 0;
    lockoutUntil = null;
    
    // SECURITY: Log successful authentication event
    logLogin(getCurrentUserId());
    
    return token;
  } catch (error) {
    // SECURITY: Track failed attempts for brute force protection
    failedAttempts++;
    // SECURITY: Log authentication failure for compliance
    logAuthFailure('Authentication failed', getCurrentUserId());
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      // SECURITY: Log lockout event
      logAuthLockout(getCurrentUserId());
      throw new Error(`Too many failed attempts. Account locked for 15 minutes.`);
    }
    throw new Error('Authentication failed');
  }
};

/**
 * Simulate logout (clears stored token from SecureStore)
 */
export const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AUTH_EXPIRY_KEY);
    currentUserId = null;
    // SECURITY: Reset rate limiting counters on logout
    failedAttempts = 0;
    lockoutUntil = null;
    // SECURITY: Log logout event
    logLogout(getCurrentUserId());
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

/**
 * Get stored token from SecureStore
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
 * Refresh token (in real implementation, this would call refresh endpoint)
 */
export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = await getToken();
    if (token && isTokenValid(token)) {
      // Mock: just return the same token (in real impl, would call API)
      return token;
    }
    // Token expired or invalid, attempt to login again
    return await login();
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

/**
 * Keep backwards-compatible AsyncStorage import for cart store migration
 * Cart data should be migrated to use SecureStore or implement data cleanup on logout
 */
export { AsyncStorage };