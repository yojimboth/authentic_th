import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  ALWAYS_THIS_DEVICE_ONLY: 'ALWAYS_THIS_DEVICE_ONLY',
}));

jest.mock('expo-crypto', () => ({
  getRandomBytes: jest.fn(() => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])),
}));

import {
  generateMockToken,
  isTokenValid,
  getTokenExpiry,
  isAuthenticated,
  getCurrentUserId,
  setCurrentUserId,
  login,
  logout,
  getToken,
  refreshToken,
} from './mockAuth';

describe('mockAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset current user ID
    setCurrentUserId(null as any);
  });

  describe('generateMockToken', () => {
    it('should generate a token with mock-jwt prefix', () => {
      const token = generateMockToken();
      expect(token).toMatch(/^mock-jwt-/);
    });

    it('should generate unique tokens', async () => {
      const token1 = generateMockToken();
      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      const token2 = generateMockToken();
      expect(token1).not.toBe(token2);
    });

    it('should include timestamp and random bytes', () => {
      const token = generateMockToken();
      const parts = token.split('-');
      expect(parts.length).toBeGreaterThanOrEqual(4); // mock-jwt-timestamp-random
    });
  });

  describe('isTokenValid', () => {
    it('should return false for null token', () => {
      expect(isTokenValid(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isTokenValid('')).toBe(false);
    });

    it('should return false for invalid prefix', () => {
      expect(isTokenValid('invalid-token')).toBe(false);
    });

    it('should return true for valid mock token', () => {
      const token = generateMockToken();
      expect(isTokenValid(token)).toBe(true);
    });

    it('should return false for expired token', () => {
      // Create a token with old timestamp
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      const token = `mock-jwt-${oldTimestamp}-abc123`;
      expect(isTokenValid(token)).toBe(false);
    });

    it('should return true for recent token', () => {
      const recentTimestamp = Date.now() - (1 * 60 * 60 * 1000); // 1 hour ago
      const token = `mock-jwt-${recentTimestamp}-abc123`;
      expect(isTokenValid(token)).toBe(true);
    });
  });

  describe('getTokenExpiry', () => {
    it('should return null for null token', () => {
      expect(getTokenExpiry(null)).toBeNull();
    });

    it('should return expiry time for valid token', () => {
      const token = generateMockToken();
      const expiry = getTokenExpiry(token);
      expect(expiry).toBeGreaterThan(Date.now());
    });
  });

  describe('getCurrentUserId / setCurrentUserId', () => {
    it('should return default user ID when not set', () => {
      const userId = getCurrentUserId();
      expect(userId).toBeTruthy();
      expect(typeof userId).toBe('string');
    });

    it('should return set user ID', () => {
      setCurrentUserId('user-123');
      expect(getCurrentUserId()).toBe('user-123');
    });

    it('should update user ID', () => {
      setCurrentUserId('user-123');
      setCurrentUserId('user-456');
      expect(getCurrentUserId()).toBe('user-456');
    });
  });

  describe('login', () => {
    it('should generate and store token', async () => {
      const result = await login();
      
      expect(result).toMatch(/^mock-jwt-/);
      expect(SecureStore.setItemAsync).toHaveBeenCalled();
    });

    it('should store token in SecureStore', async () => {
      await login();
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        expect.stringContaining('auth_token'),
        expect.any(String),
        expect.objectContaining({
          keychainAccessible: 'ALWAYS_THIS_DEVICE_ONLY',
        })
      );
    });
  });

  describe('logout', () => {
    it('should remove token from SecureStore', async () => {
      // First login to set token
      await login();
      
      // Clear mocks to verify logout calls
      (SecureStore.deleteItemAsync as jest.Mock).mockClear();
      
      await logout();
      
      expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
    });
  });

  describe('getToken', () => {
    it('should return null when no token stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      
      const token = await getToken();
      expect(token).toBeNull();
    });

    it('should return stored token', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('mock-jwt-token123');
      
      const token = await getToken();
      expect(token).toBe('mock-jwt-token123');
    });
  });

  describe('refreshToken', () => {
    it('should return existing token if valid', async () => {
      const token = generateMockToken();
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(token);
      
      const result = await refreshToken();
      expect(result).toBe(token);
    });

    it('should generate new token if none stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      
      const result = await refreshToken();
      expect(result).toMatch(/^mock-jwt-/);
    });
  });
});