import { useState, useEffect } from 'react';
import apiClient from '../../../services/api-client';
import { currentConfig } from '../../../config/whiteLabelConfig';
import { MenuCategory, AsyncState } from '../types';

export const useMenu = () => {
  const [state, setState] = useState<AsyncState<MenuCategory[]>>({ status: 'idle' });

  const fetchMenu = async () => {
    setState({ status: 'loading' });
    try {
      const response = await apiClient.get<MenuCategory[]>('/menu', {
        headers: {
          'x-tenant-id': currentConfig.tenantId,
        },
      });
      setState({ status: 'success', data: response.data });
    } catch (error: any) {
      // Security: Don't expose internal error details to users
      console.error('Menu fetch error:', error);
      setState({ status: 'error', error: 'Failed to load menu. Please try again.' });
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return { state, refresh: fetchMenu };
};
