import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    const { hideToast, hideSidebar } = useUIStore.getState();
    hideToast();
    hideSidebar();
    // Reset to initial state
    useUIStore.setState({
      sidebarOpen: true,
      toast: null,
      toggleSidebar: useUIStore.getState().toggleSidebar,
      showSidebar: useUIStore.getState().showSidebar,
      hideSidebar: useUIStore.getState().hideSidebar,
      showToast: useUIStore.getState().showToast,
      hideToast: useUIStore.getState().hideToast,
    });
  });
  it('TC-UI-001a: should initialize with sidebar open', () => {
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('TC-UI-001b: should toggle sidebar', () => {
    const { toggleSidebar } = useUIStore.getState();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
    toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('TC-UI-001c: should show sidebar', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
    useUIStore.getState().showSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('TC-UI-001d: should hide sidebar', () => {
    expect(useUIStore.getState().sidebarOpen).toBe(true);
    useUIStore.getState().hideSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it('TC-UI-002: should show toast', () => {
    const { showToast } = useUIStore.getState();
    showToast('Test message', 'success');
    const toast = useUIStore.getState().toast;
    expect(toast).toBeDefined();
    expect(toast!.message).toBe('Test message');
    expect(toast!.type).toBe('success');
    expect(toast!.visible).toBe(true);
  });

  it('TC-UI-002b: should show error toast', () => {
    const { showToast } = useUIStore.getState();
    showToast('Error occurred', 'error');
    const toast = useUIStore.getState().toast;
    expect(toast!.type).toBe('error');
  });

  it('TC-UI-002c: should show info toast', () => {
    const { showToast } = useUIStore.getState();
    showToast('Info message', 'info');
    const toast = useUIStore.getState().toast;
    expect(toast!.type).toBe('info');
  });

  it('TC-UI-003: should hide toast', () => {
    const { showToast, hideToast } = useUIStore.getState();
    showToast('Test message', 'success');
    hideToast();
    expect(useUIStore.getState().toast).toBeNull();
  });

  it('TC-UI-003b: should overwrite toast when new one shown', () => {
    const { showToast } = useUIStore.getState();
    showToast('First message', 'success');
    showToast('Second message', 'error');
    const toast = useUIStore.getState().toast;
    expect(toast!.message).toBe('Second message');
    expect(toast!.type).toBe('error');
  });

  it('should initialize toast as null', () => {
    expect(useUIStore.getState().toast).toBeNull();
  });
});