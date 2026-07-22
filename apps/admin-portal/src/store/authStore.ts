import { create } from 'zustand';

type AdminRole = 'FOUNDER' | 'CO_FOUNDER' | null;

interface AuthState {
  user: string | null;
  role: AdminRole;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; role?: AdminRole };
  logout: () => void;
}

const MOCK_USERS = {
  'founder@authentic.com': { password: 'password123', role: 'FOUNDER' as AdminRole },
  'cofounder@authentic.com': { password: 'password123', role: 'CO_FOUNDER' as AdminRole },
};

// Check for existing valid token on app load
const initializeAuth = (): { user: string | null; role: AdminRole; token: string | null; isAuthenticated: boolean } => {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        if (decoded.exp > Date.now()) {
          return {
            user: decoded.sub || null,
            role: decoded.role as AdminRole,
            token,
            isAuthenticated: true,
          };
        }
      } catch {
        // Invalid token format
      }
    }
  } catch {
    // localStorage access error
  }
  return { user: null, role: null, token: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = initializeAuth();
  return {
    ...initialState,

    login: (email: string, password: string) => {
      const user = MOCK_USERS[email as keyof typeof MOCK_USERS];
      if (user && user.password === password) {
        const token = btoa(JSON.stringify({ sub: email, tid: 'platform-tid', role: user.role, exp: Date.now() + 3600000 }));
        localStorage.setItem('auth_token', token);
        set({
          user: email,
          role: user.role,
          token,
          isAuthenticated: true,
        });
        return { success: true, role: user.role };
      }
      return { success: false };
    },

    logout: () => {
      localStorage.removeItem('auth_token');
      set({
        user: null,
        role: null,
        token: null,
        isAuthenticated: false,
      });
    },
  };
});