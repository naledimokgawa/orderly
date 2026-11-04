'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserSession = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
};

const navBase = [
  { href: '/orders', label: 'Orders' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Staff Members' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('orderly-user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    localStorage.removeItem('orderly-user');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // no-op
    }
    router.push('/login');
  };

  const visibleNav = user?.role === 'admin'
    ? [...navBase]
    : user?.role === 'staff'
      ? [{ href: '/orders', label: 'Orders' }, { href: '/dashboard', label: 'Dashboard' }]
      : [{ href: '/orders', label: 'Orders' }];

  return (
    <div className="min-h-screen bg-[#f1f2f8] text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#4f46e5]">
            Ordarly
          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium">
            {!user && (
              <>
                <Link
                  href="/login"
                  className={`rounded-md px-3 py-2 transition ${isActive('/login') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-indigo-700'}`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`rounded-md px-3 py-2 transition ${isActive('/signup') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-indigo-700'}`}
                >
                  Signup
                </Link>
              </>
            )}

            {visibleNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 transition ${isActive(item.href) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-indigo-700'}`}
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-700 transition hover:border-slate-400 hover:text-indigo-700"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
