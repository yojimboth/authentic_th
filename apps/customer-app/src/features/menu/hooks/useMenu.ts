import { useState, useEffect } from 'react';
import apiClient from 'api-client';
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
      setState({ status: 'error', error: error.message || 'Failed to fetch menu' });
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return { state, refresh: fetchMenu };
};
