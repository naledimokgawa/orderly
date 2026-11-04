'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '../../../components/AppShell';

type Order = {
  id: number;
  customer_name: string;
  description: string;
  order_date: string;
  status: 'preparing' | 'done' | 'cancelled';
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrder() {
      const response = await fetch(`/api/orders/${params.orderId}`);
      const data = await response.json();
      setOrder(data.order || null);
    }

    if (params.orderId) {
      loadOrder();
    }
  }, [params.orderId]);

  if (!order) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">Loading order...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Order #{order.id}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-800">{order.customer_name}</h1>

        <div className="mt-6 space-y-4 text-slate-700">
          <p><span className="font-semibold">Description:</span> {order.description}</p>
          <p><span className="font-semibold">Date:</span> {order.order_date}</p>
          <p><span className="font-semibold">Status:</span> <span className="capitalize">{order.status}</span></p>
        </div>
      </div>
    </AppShell>
  );
}

