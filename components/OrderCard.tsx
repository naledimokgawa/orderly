type Order = {
  id: number;
  customer_name: string;
  description: string;
  order_date: string;
  status: 'preparing' | 'done' | 'cancelled';
  created_by_name?: string;
};

export function OrderCard({ order, onDone, onDelete }: { order: Order; onDone?: (id: number) => void; onDelete?: (id: number) => void }) {
  const statusColors = {
    preparing: 'bg-amber-100 text-amber-800',
    done: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Order #{order.id}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-800">{order.customer_name}</h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-600">{order.description}</p>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{order.order_date}</span>
        {order.created_by_name && <span>By {order.created_by_name}</span>}
      </div>

      {(onDone || onDelete) && (
        <div className="mt-5 flex gap-3">
          {onDone && order.status !== 'done' && (
            <button
              type="button"
              onClick={() => onDone(order.id)}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Mark as done
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(order.id)}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
