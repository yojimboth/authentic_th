import { useState, useEffect } from 'react';
import apiClient from 'api-client';
import { AsyncState } from '../../menu/types';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  primaryAddress: string;
}

export const useProfile = () => {
  const [state, setState] = useState<AsyncState<UserProfile>>({ status: 'idle' });

  const fetchProfile = async () => {
    setState({ status: 'loading' });
    try {
      const response = await apiClient.get<UserProfile>('/user/profile');
      setState({ status: 'success', data: response.data });
    } catch (error: any) {
      setState({ status: 'error', error: error.message || 'Failed to fetch profile' });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { state, refresh: fetchProfile };
};
