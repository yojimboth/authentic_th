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
  randomUUID: jest.fn(() => '12345678-1234-4123-8123-123456789abc'),
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
  requestVerificationCode,
  verifyCode,
  completeProfile,
  refreshAccessToken,
  generateRefreshToken,
} from './mockAuth';

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

describe('mockAuth', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  /**
   * Helper to extract OTP code from console log.
   * Since OTP is now random, we capture it from the log.
   */
  const captureOTP = (): string => {
    // The console.log format is: "[MOCK OTP] Verification code for test@example.com: 123456"
    const logCall = consoleSpy.mock.calls.find((call: any[]) =>
      typeof call[0] === 'string' && call[0].includes('MOCK OTP')
    );
    if (logCall) {
      const match = (logCall[0] as string).match(/: (\d{6})$/);
      return match ? match[1] : '';
    }
    return '';
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
    setCurrentUserId(null as any);
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  // ─── Token Generation & Validation ────────────────────────────

  describe('generateMockToken', () => {
    it('should generate a token with mock-jwt prefix', () => {
      const token = generateMockToken();
      expect(token).toMatch(/^mock-jwt-/);
    });

    it('should generate unique tokens', async () => {
      const token1 = generateMockToken();
      await new Promise(resolve => setTimeout(resolve, 10));
      const token2 = generateMockToken();
      expect(token1).not.toBe(token2);
    });

    it('should include timestamp and random bytes', () => {
      const token = generateMockToken();
      const parts = token.split('-');
      expect(parts.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a UUID-formatted string', () => {
      const token = generateRefreshToken();
      expect(token).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
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

    it('should return false for expired token (> 15 minutes)', () => {
      const oldTimestamp = Date.now() - (16 * 60 * 1000);
      const token = `mock-jwt-${oldTimestamp}-abc123`;
      expect(isTokenValid(token)).toBe(false);
    });

    it('should return true for recent token (< 15 minutes)', () => {
      const recentTimestamp = Date.now() - (1 * 60 * 1000);
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
      expect(expiry).toBeCloseTo(Date.now() + FIFTEEN_MINUTES_MS, -2);
    });
  });

  // ─── User ID Management ───────────────────────────────────────

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

  // ─── Login / Logout ───────────────────────────────────────────

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
    it('should remove tokens from SecureStore', async () => {
      await login();
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

  // ─── OTP Flow ─────────────────────────────────────────────────

  describe('requestVerificationCode', () => {
    it('should return { sent: true } for valid email', async () => {
      const result = await requestVerificationCode('test@example.com');
      expect(result).toEqual({ sent: true });
    });

    it('should throw for invalid email', async () => {
      await expect(requestVerificationCode('not-an-email')).rejects.toThrow(
        'Invalid email address'
      );
    });

    it('should throw for empty email', async () => {
      await expect(requestVerificationCode('')).rejects.toThrow(
        'Invalid email address'
      );
    });

    it('should log the OTP code to console', async () => {
      const otp = await requestVerificationCode('test@example.com');
      expect(otp).toEqual({ sent: true });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('MOCK OTP')
      );
    });

    it('should generate a 6-digit OTP', async () => {
      await requestVerificationCode('test@example.com');
      const otp = captureOTP();
      expect(otp).toMatch(/^\d{6}$/);
    });
  });

  describe('verifyCode', () => {
    it('should throw if no code was requested', async () => {
      await expect(
        verifyCode('unknown@example.com', '000000')
      ).rejects.toThrow('No verification code found');
    });

    it('should throw on invalid code', async () => {
      await requestVerificationCode('test@example.com');
      await expect(
        verifyCode('test@example.com', '000000')
      ).rejects.toThrow('Invalid verification code');
    });

    it('should return requiresProfile for new user with valid code', async () => {
      // SecureStore returns null for user profile (new user)
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      await requestVerificationCode('new@example.com');
      const otp = captureOTP();
      const result = await verifyCode('new@example.com', otp);
      expect(result.requiresProfile).toBe(true);
    });

    it('should return user session for existing user with valid code', async () => {
      const mockProfile = {
        id: 'user_123',
        email: 'returning@example.com',
        fullName: 'Test User',
        phone: '+61400000000',
        loyaltyPoints: 100,
        isComplete: true,
      };

      // Mock chain: user profile lookup + storeRefreshToken reads
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockProfile)) // getUserProfile
        .mockResolvedValueOnce(null); // storeRefreshToken: REFRESH_TOKEN_KEY

      await requestVerificationCode('returning@example.com');
      const otp = captureOTP();
      const result = await verifyCode('returning@example.com', otp);
      expect(result.requiresProfile).toBe(false);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('returning@example.com');
    });
  });

  describe('OTP brute-force protection', () => {
    it('should throw after MAX_OTP_ATTEMPTS failed attempts', async () => {
      await requestVerificationCode('brute@example.com');

      // 4 wrong attempts should throw 'Invalid verification code'
      for (let i = 0; i < 4; i++) {
        await expect(
          verifyCode('brute@example.com', '000000')
        ).rejects.toThrow('Invalid verification code');
      }

      // 5th attempt should throw about too many attempts
      await expect(
        verifyCode('brute@example.com', '000000')
      ).rejects.toThrow('Too many failed attempts');
    });
  });

  // ─── Complete Profile ─────────────────────────────────────────

  describe('completeProfile', () => {
    it('should create user profile and return session data', async () => {
      // Mock storeRefreshToken: reads REFRESH_TOKEN_KEY (setItem, not getItem)
      // getItemAsync is only called for the refresh token store check
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const result = await completeProfile({
        name: 'John Doe',
        phone: '+61400123456',
        email: 'john@example.com',
      });

      expect(result.user).toBeDefined();
      expect(result.user.fullName).toBe('John Doe');
      expect(result.user.phone).toBe('+61400123456');
      expect(result.user.email).toBe('john@example.com');
      expect(result.user.loyaltyPoints).toBe(0);
      expect(result.user.isComplete).toBe(true);
      expect(result.accessToken).toMatch(/^mock-jwt-/);
      expect(result.refreshToken).toBeTruthy();
    });

    it('should throw if required fields are missing', async () => {
      await expect(
        completeProfile({ name: '', phone: '', email: '' })
      ).rejects.toThrow('Name, phone, and email are required');
    });
  });

  // ─── Refresh Access Token ─────────────────────────────────────

  describe('refreshAccessToken', () => {
    it('should return null for unknown refresh token', async () => {
      const result = await refreshAccessToken('unknown-token');
      expect(result).toBeNull();
    });

    it('should return new tokens for valid refresh token', async () => {
      // refreshAccessToken reads:
      //   1. getItem(REFRESH_TOKEN_KEY) -> 'valid-refresh-token'
      //   2. getItem(REFRESH_TOKEN_EXPIRY_KEY) -> future timestamp
      // Then storeTokens generates and stores new tokens (setItem calls only)
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce('valid-refresh-token')
        .mockResolvedValueOnce((Date.now() + 86400000).toString());

      const result = await refreshAccessToken('valid-refresh-token');
      expect(result).not.toBeNull();
      expect(result?.accessToken).toMatch(/^mock-jwt-/);
      expect(result?.refreshToken).toBeTruthy();

      // Verify tokens were stored
      expect(SecureStore.setItemAsync).toHaveBeenCalled();
    });
  });
});