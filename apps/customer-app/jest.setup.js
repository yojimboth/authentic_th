// Jest setup: polyfill localStorage for React Native test environment
//
// React Native does not include a native localStorage implementation.
// This polyfill is required by the mock API client (services/api-client)
// which uses localStorage for in-memory token storage during frontend-first development.

if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};

  globalThis.localStorage = {
    getItem(key: string): string | null {
      return store[key] ?? null;
    },
    setItem(key: string, value: string): void {
      store[key] = String(value);
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key(index: number): string | null {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
  };
}