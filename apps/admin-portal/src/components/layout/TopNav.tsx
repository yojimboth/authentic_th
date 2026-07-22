import React from 'react';
import { useAuthStore } from '../../store/authStore';

export function TopNav() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-base font-semibold text-zinc-900">Platform Governance</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {user || 'Admin'}
        </span>
        <button
          onClick={logout}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}