'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../components/AppShell';

type UserSession = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('orderly-user');
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  return (
    <AppShell>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
        <h1 className="mt-3 text-4xl font-black text-slate-800">
          Welcome back, {user?.name || 'Team member'}
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          {user?.role === 'admin'
            ? 'You are signed in as an administrator and can manage staff members and orders.'
            : 'You are signed in as a staff member and can manage daily orders.'}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-indigo-50 p-5">
            <p className="text-sm text-indigo-700">Role</p>
            <p className="mt-2 text-xl font-bold capitalize">{user?.role || 'staff'}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-sm text-emerald-700">Email</p>
            <p className="mt-2 text-xl font-bold">{user?.email || 'N/A'}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-5">
            <p className="text-sm text-amber-700">Status</p>
            <p className="mt-2 text-xl font-bold">Active</p>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  OAuth status
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">GitHub authentication</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                Enabled
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <p className="text-sm text-slate-500">Local callback</p>
                <p className="mt-2 break-all text-sm font-medium text-slate-800">
                  http://localhost:3000/api/auth/callback/github
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-sm text-slate-500">Production callback</p>
                <p className="mt-2 break-all text-sm font-medium text-slate-800">
                  https://orderly-amber.vercel.app/api/auth/callback/github
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
