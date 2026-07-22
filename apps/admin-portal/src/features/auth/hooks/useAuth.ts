import { useAuthStore } from '../../../store/authStore';

export function useAuth() {
  const { user, role, isAuthenticated, logout } = useAuthStore();
  return { user, role, isAuthenticated, logout };
}