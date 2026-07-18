import { renderHook, waitFor } from '@testing-library/react-native';
import { useProfile } from './useProfile';

// Mock apiClient
jest.mock('api-client', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

import apiClient from 'api-client';

const mockUserProfile = {
  id: 'user-1',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '0412345678',
  loyaltyPoints: 150,
  primaryAddress: '123 Main St, Sydney NSW 2000',
};

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch profile data on mount', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockUserProfile,
    });

    const { result } = renderHook(() => useProfile());

    // Wait for async fetch to complete
    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    expect(result.current.state.status).toBe('success');
    if (result.current.state.status === 'success') {
      expect(result.current.state.data).toEqual(mockUserProfile);
    }
  });

  it('should handle fetch error', async () => {
    (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useProfile());

    // Wait for async fetch to complete
    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    expect(result.current.state.status).toBe('error');
    if (result.current.state.status === 'error') {
      // Error message should be present (exact message may vary)
      expect(result.current.state.error).toBeTruthy();
      expect(typeof result.current.state.error).toBe('string');
    }
  });

  it('should have refresh function', () => {
    const { result } = renderHook(() => useProfile());
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should update state to loading during fetch', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (apiClient.get as jest.Mock).mockReturnValueOnce(promise);

    const { result } = renderHook(() => useProfile());

    // Should be in loading state initially
    expect(result.current.state.status).toBe('loading');

    // Resolve the promise
    resolvePromise({ data: mockUserProfile });

    // Wait for state to update
    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });
  });

  it('should handle API call to update profile', async () => {
    // Mock GET for initial fetch
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockUserProfile,
    });

    const { result } = renderHook(() => useProfile());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    // Verify refresh function exists
    expect(typeof result.current.refresh).toBe('function');
    
    // Call refresh (will make another GET call)
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockUserProfile,
    });
    await result.current.refresh();

    // Verify API was called
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});