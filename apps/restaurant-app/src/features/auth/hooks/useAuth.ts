import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { login as mockLogin, logout as mockLogout, getToken, isTokenValid } from '../../../utils/mockAuth';
import { RestaurantOwner } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: storeLogout, setTokens } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSession = async () => {
    try {
      // Only restore session if a valid token already exists
      const existingToken = await getToken();
      if (existingToken && isTokenValid(existingToken)) {
        const mockUser: RestaurantOwner = {
          id: 'usr_123',
          tenantId: 'tenant_siam_001',
          fullName: 'John Smith',
          email: 'john@siamauthentic.com',
          phone: '0412345678',
          role: 'owner',
          primaryAddress: '123 Restaurant St, Sydney NSW 2000',
        };
        setTokens(existingToken, 'mock-refresh-token');
        setUser(mockUser);
        return { success: true };
      }
      // No valid session to restore
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await mockLogin();
      const mockUser: RestaurantOwner = {
        id: 'usr_123',
        tenantId: 'tenant_siam_001',
        fullName: 'John Smith',
        email: 'john@siamauthentic.com',
        phone: '0412345678',
        role: 'owner',
        primaryAddress: '123 Restaurant St, Sydney NSW 2000',
      };
      setTokens(token, 'mock-refresh-token');
      setUser(mockUser);
      return { success: true };
    } catch (err: any) {
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await mockLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    storeLogout();
  };

  useEffect(() => {
    checkSession();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkSession,
  };
};