import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import {
  AuthState,
  UserProfile,
  UserSession,
  GuestSession,
} from '../features/auth/types';
import * as mockAuth from '../utils/mockAuth';
import { logAuthEvent } from '../utils/auditLogger';

const AUTH_STORAGE_KEY = '@auth_session';

const secureStorePersist = createJSONStorage(() => ({
  getItem: async (key: string) => {
    if (key !== AUTH_STORAGE_KEY) return null;
    try {
      const value = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (key !== AUTH_STORAGE_KEY) return;
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
      });
    } catch {
      // Silently fail - auth session is non-critical
    }
  },
  removeItem: async (key: string) => {
    if (key !== AUTH_STORAGE_KEY) return;
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Silently fail
    }
  },
}));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'checking',
      session: null,
      guest: null,

      initialize: async () => {
        const valid = await mockAuth.isAuthenticated();
        if (valid) {
          const token = await mockAuth.getToken();
          if (token) {
            set({
              status: 'member',
              session: {
                accessToken: token,
                refreshToken: '',
                user: {
                  id: '',
                  email: '',
                  fullName: '',
                  phone: '',
                  loyaltyPoints: 0,
                  isComplete: true,
                },
                isAuthenticated: true,
              },
            });
            logAuthEvent('AUTH_LOGIN', {}, 'persisted-session');
          } else {
            set({ status: 'unauthenticated' });
          }
        } else {
          set({ status: 'unauthenticated' });
        }
      },

      requestCode: async (email: string) => {
        try {
          const result = await mockAuth.requestVerificationCode(email);
          logAuthEvent('AUTH_OTP_REQUEST', { email }, email);
          return result;
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Unknown error';
          logAuthEvent('AUTH_OTP_FAILURE', { reason: message }, email);
          return { error: message };
        }
      },

      verifyCode: async (
        email: string,
        code: string
      ) => {
        try {
          const result = await mockAuth.verifyCode(email, code);
          if (result.requiresProfile) {
            set({ status: 'profile-pending' });
            return { requiresProfile: true };
          } else if (result.user) {
            const session: UserSession = {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              user: result.user,
              isAuthenticated: true,
            };
            set({ status: 'member', session });
            logAuthEvent('AUTH_LOGIN', {}, email);
            return { requiresProfile: false, user: result.user };
          }
          return { requiresProfile: false };
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Unknown error';
          logAuthEvent('AUTH_OTP_VERIFY_FAILURE', { reason: message }, email);
          return { error: message };
        }
      },

      completeProfile: async (data) => {
        const result = await mockAuth.completeProfile(data);
        const session: UserSession = {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
          isAuthenticated: true,
        };
        set({ status: 'member', session });
        logAuthEvent(
          'AUTH_PROFILE_COMPLETE',
          { userId: result.user.id },
          data.email
        );
        return session;
      },

      setGuest: () => {
        const guest: GuestSession = { isGuest: true, cartPreserved: true };
        set({ status: 'guest', guest });
      },

      logout: async () => {
        await mockAuth.logout();
        set({
          status: 'unauthenticated',
          session: null,
          guest: null,
        });
        logAuthEvent('AUTH_LOGOUT', {});
      },

      clearSession: () => {
        set({
          status: 'unauthenticated',
          session: null,
          guest: null,
        });
      },

      // Computed getters (derived from status)
      isGuest: () => get().status === 'guest',
      isMember: () => get().status === 'member',
      requiresProfile: () => get().status === 'profile-pending',
      isAuthenticated: () => get().isMember() || get().isGuest(),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: secureStorePersist,
      partialize: (state) => ({
        status: state.status,
        guest: state.guest,
      }),
    }
  )
);