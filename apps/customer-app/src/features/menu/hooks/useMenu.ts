import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';
import { MenuCategory, AsyncState } from '../types';

export const useMenu = () => {
  const [state, setState] = useState<AsyncState<MenuCategory[]>>({ status: 'idle' });

  const fetchMenu = async () => {
    setState({ status: 'loading' });
    try {
      const response = await apiClient.get<MenuCategory[]>('/menu');
      setState({ status: 'success', data: response.data });
    } catch (error: any) {
      setState({ status: 'error', error: error.message || 'Failed to fetch menu' });
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return { state, refresh: fetchMenu };
};
