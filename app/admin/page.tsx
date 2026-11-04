'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../components/AppShell';

type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  created_at: string;
};

export default function AdminPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    async function loadStaff() {
      const response = await fetch('/api/staff');
      const data = await response.json();
      setStaff(data.staff || []);
    }

    loadStaff();
  }, []);

  return (
    <AppShell>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black text-slate-800">Staff members</h1>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            {staff.length} team members
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {staff.map((member) => (
            <div key={member.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{member.role}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">{member.name}</h2>
              <p className="mt-2 text-slate-600">{member.email}</p>
              <p className="mt-4 text-xs text-slate-500">Joined {new Date(member.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
