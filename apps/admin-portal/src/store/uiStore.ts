import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean } | null;
  toggleSidebar: () => void;
  showSidebar: () => void;
  hideSidebar: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toast: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  showSidebar: () => set({ sidebarOpen: true }),
  hideSidebar: () => set({ sidebarOpen: false }),

  showToast: (message, type) => set({ toast: { message, type, visible: true } }),
  hideToast: () => set({ toast: null }),
}));