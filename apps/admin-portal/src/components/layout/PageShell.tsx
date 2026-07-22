import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { TopNav } from './TopNav';
import { Outlet } from 'react-router-dom';

export function PageShell() {
  return (
    <div className="flex h-screen bg-zinc-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}