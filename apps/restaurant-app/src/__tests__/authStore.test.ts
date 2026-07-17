import { useAuthStore } from '../store/authStore';
import { RestaurantOwner } from '../features/auth/types';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts with no user', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets user on setUser', () => {
    const mockUser: RestaurantOwner = {
      id: 'usr_1',
      tenantId: 'tenant_1',
      fullName: 'Test User',
      email: 'test@test.com',
      role: 'owner',
    };
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('sets tokens on setTokens', () => {
    useAuthStore.getState().setTokens('access-123', 'refresh-456');
    expect(useAuthStore.getState().accessToken).toBe('access-123');
    expect(useAuthStore.getState().refreshToken).toBe('refresh-456');
  });

  it('clears everything on logout', () => {
    useAuthStore.getState().setUser({
      id: 'usr_1',
      tenantId: 'tenant_1',
      fullName: 'Test',
      email: 'test@test.com',
      role: 'owner',
    });
    useAuthStore.getState().setTokens('access', 'refresh');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});