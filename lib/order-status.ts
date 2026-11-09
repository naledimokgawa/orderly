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
