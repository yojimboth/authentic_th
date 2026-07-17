import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { RestaurantOwner } from '../../auth/types';

export const useProfile = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = () => {
    return user;
  };

  const updateProfile = async (phone: string, address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (user) {
        const updated: RestaurantOwner = {
          ...user,
          phone: phone || user.phone,
          primaryAddress: address || user.primaryAddress,
        };
        setUser(updated);
      }
      return { success: true };
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile: loadProfile(),
    isLoading,
    error,
    updateProfile,
  };
};