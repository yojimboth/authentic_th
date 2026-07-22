import React, { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';

const typeClasses = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export function Toast() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast?.visible) {
      const timer = setTimeout(() => hideToast(), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast?.visible) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-enter">
      <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${typeClasses[toast.type]}`}>
        <span className="text-sm font-medium">{toast.message}</span>
        <button onClick={hideToast} className="ml-2 opacity-60 hover:opacity-100">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}