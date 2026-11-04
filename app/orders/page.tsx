'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { OrderCard } from '../../components/OrderCard';

type UserSession = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
};

type Order = {
  id: number;
  customer_name: string;
  description: string;
  order_date: string;
  status: 'preparing' | 'done' | 'cancelled';
  created_by_name?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('orderly-user');
    if (raw) {
      setUser(JSON.parse(raw));
    }
    loadOrders();
  }, []);

  async function loadOrders() {
    const response = await fetch('/api/orders');
    const data = await response.json();
    setOrders(data.orders || []);
  }

  async function handleCreateOrder(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, description, orderDate }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to create order');

      setSuccess('Order created successfully.');
      setCustomerName('');
      setDescription('');
      setOrderDate(new Date().toISOString().slice(0, 10));
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create order');
    }
  }

  async function handleMarkDone(id: number) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    await loadOrders();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    await loadOrders();
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {user && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">Create an order</h2>
            <form onSubmit={handleCreateOrder} className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Customer name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Order description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Order date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="md:col-span-3 flex items-center gap-3">
                <button type="submit" className="rounded-xl bg-[#4f46e5] px-5 py-3 font-semibold text-white hover:bg-[#4338ca]">
                  Save order
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-emerald-600">{success}</p>}
              </div>
            </form>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Current orders</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {orders.length} total
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onDone={user ? handleMarkDone : undefined}
                onDelete={user ? handleDelete : undefined}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

