import { BOARD_LIMITS } from './order-status';

/**
 * Columns that are safe to expose to guests and customer accounts:
 * the tracking number, status and the customer's first name only
 * (never the surname, description, date or staff details).
 */
export const PUBLIC_ORDER_COLUMNS = `id, status,
  split_part(regexp_replace(btrim(customer_name), '[[:space:]]+', ' ', 'g'), ' ', 1) AS customer_first_name`;

/** Orders a guest can look up by tracking number. Cancelled orders are never shown. */
export const PUBLIC_ORDER_FILTER = `status IN ('pending', 'preparing', 'done')`;

/**
 * The public board, capped by BOARD_LIMITS: the oldest pending and preparing
 * orders (next in the queue) and the most recently finished done orders.
 * Mirrors capOrdersForBoard in order-status.ts.
 */
export const PUBLIC_BOARD_QUERY = `
  SELECT ${PUBLIC_ORDER_COLUMNS}
  FROM (
    SELECT o.*,
      ROW_NUMBER() OVER (
        PARTITION BY status
        ORDER BY CASE WHEN status = 'done' THEN updated_at END DESC, created_at ASC, id ASC
      ) AS board_rank
    FROM orders o
    WHERE ${PUBLIC_ORDER_FILTER}
  ) ranked
  WHERE (status = 'pending' AND board_rank <= ${BOARD_LIMITS.pending})
     OR (status = 'preparing' AND board_rank <= ${BOARD_LIMITS.preparing})
     OR (status = 'done' AND board_rank <= ${BOARD_LIMITS.done})
  ORDER BY status, board_rank`;
