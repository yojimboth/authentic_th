import { renderHook, act } from '@testing-library/react-native';
import { useMenu } from './useMenu';

// Mock apiClient
jest.mock('api-client', () => ({
  get: jest.fn(),
}));

import apiClient from 'api-client';

const mockMenuData = [
  {
    category: 'Appetizers',
    items: [
      {
        id: 'item-1',
        name: 'Spring Rolls',
        description: 'Crispy spring rolls',
        price: 10.00,
        spice: 1,
        isAvailable: true,
        imageUrl: 'https://example.com/spring-rolls.jpg',
      },
    ],
  },
  {
    category: 'Mains',
    items: [
      {
        id: 'item-2',
        name: 'Pad Thai',
        description: 'Thai noodle dish',
        price: 15.50,
        spice: 2,
        isAvailable: true,
        imageUrl: 'https://example.com/pad-thai.jpg',
      },
    ],
  },
];

describe('useMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch menu data on mount', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockMenuData,
    });

    const { result } = renderHook(() => useMenu());

    // Wait for async fetch to complete
    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    expect(result.current.state.status).toBe('success');
    expect(result.current.state.data).toEqual(mockMenuData);
  });

  it('should handle fetch error', async () => {
    (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMenu());

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
    const { result } = renderHook(() => useMenu());
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should update state to loading during fetch', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (apiClient.get as jest.Mock).mockReturnValueOnce(promise);

    const { result } = renderHook(() => useMenu());

    // Should be in loading state initially
    expect(result.current.state.status).toBe('loading');

    // Resolve the promise
    resolvePromise({ data: mockMenuData });

    // Wait for state to update
    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });
  });
});

// Helper for waitFor (if not available from testing-library)
const waitFor = (fn: () => void, options = { timeout: 5000 }) => {
  const { waitFor: tlWaitFor } = require('@testing-library/react-native');
  return tlWaitFor(fn, options);
};