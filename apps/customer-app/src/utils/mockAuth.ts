import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mock Authentication Utilities
 * 
 * This module provides mock authentication that simulates real JWT/OAuth behavior.
 * It can be seamlessly replaced with real authentication when transitioning to
 * a real backend.
 * 
 * Security Features:
 * - Token-based authentication (simulated JWT)
 * - Token expiration checking
 * - Secure token storage in AsyncStorage
 * - Token validation before accessing protected routes
 */

const AUTH_TOKEN_KEY = '@auth_token';
const AUTH_EXPIRY_KEY = '@auth_expiry';
const CURRENT_USER_ID = 'user_001';

// Token expiration: 24 hours in milliseconds
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Generate a mock JWT token for testing
 * In production, this would be replaced with real OAuth/JWT flow
 */
export const generateMockToken = (): string => {
  return `mock-jwt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if a token is valid (exists and hasn't expired)
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  // Mock: check token starts with mock-jwt- prefix
  return token.startsWith('mock-jwt-');
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
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return isTokenValid(token) && getTokenExpiry(token) > Date.now();
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

/**
 * Get the current user ID from mock auth
 */
export const getCurrentUserId = (): string => {
  return CURRENT_USER_ID;
};

/**
 * Simulate login (generates and stores mock token)
 */
export const login = async (): Promise<string> => {
  try {
    const token = generateMockToken();
    const expiry = Date.now() + TOKEN_EXPIRY_MS;
    
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());
    
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Authentication failed');
  }
};

/**
 * Simulate logout (clears stored token)
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(AUTH_EXPIRY_KEY);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

/**
 * Get stored token
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
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