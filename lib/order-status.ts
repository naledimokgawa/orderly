/**
 * Order lifecycle: pending -> preparing -> done.
 * `cancelled` is a staff-only terminal state that is never shown publicly.
 */
export const ORDER_STATUSES = ['pending', 'preparing', 'done', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Statuses customers and guests can see on the public order board. */
export const PUBLIC_ORDER_STATUSES = ['pending', 'preparing', 'done'] as const;
export type PublicOrderStatus = (typeof PUBLIC_ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  done: 'Done',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_PALETTE: Record<OrderStatus, string> = {
  pending: 'gray',
  preparing: 'orange',
  done: 'green',
  cancelled: 'red',
};

/** The next step for an order, and the label of the button that moves it there. */
export const NEXT_ORDER_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; action: string }>> = {
  pending: { status: 'preparing', action: 'Start preparing' },
  preparing: { status: 'done', action: 'Mark as done' },
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && (ORDER_STATUSES as readonly string[]).includes(value);
}

/** How many orders of each status the board shows (10 in total). Cancelled orders are left off. */
export const BOARD_LIMITS: Record<PublicOrderStatus, number> = { pending: 3, preparing: 3, done: 4 };

type BoardOrder = { id: number; status: OrderStatus; created_at?: string; updated_at?: string };

/**
 * Apply the board limits: the oldest pending and preparing orders (next in the queue)
 * and the most recently finished done orders, returned in pending, preparing, done order.
 */
export function capOrdersForBoard<T extends BoardOrder>(orders: T[]): T[] {
  const time = (value?: string) => (value ? new Date(value).getTime() : 0);
  return PUBLIC_ORDER_STATUSES.flatMap((status) =>
    orders
      .filter((order) => order.status === status)
      .sort((a, b) =>
        status === 'done'
          ? time(b.updated_at) - time(a.updated_at) || a.id - b.id
          : time(a.created_at) - time(b.created_at) || a.id - b.id
      )
      .slice(0, BOARD_LIMITS[status])
  );
}
