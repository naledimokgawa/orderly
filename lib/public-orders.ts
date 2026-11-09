/**
 * Columns that are safe to expose to guests and customer accounts:
 * the tracking number, status and the customer's first name only
 * (never the surname, description, date or staff details).
 */
export const PUBLIC_ORDER_COLUMNS = `id, status,
  split_part(regexp_replace(btrim(customer_name), '[[:space:]]+', ' ', 'g'), ' ', 1) AS customer_first_name`;

/** Orders a guest can look up by tracking number. Cancelled orders are never shown. */
export const PUBLIC_ORDER_FILTER = `status IN ('pending', 'preparing', 'done')`;

/** How many orders of each status the public board shows (10 in total). */
export const PUBLIC_BOARD_LIMITS = { pending: 3, preparing: 3, done: 4 } as const;

/**
 * The public board: the 3 oldest pending orders (next in the queue),
 * the 3 oldest preparing orders, and the 4 most recently finished orders.
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
  WHERE (status = 'pending' AND board_rank <= ${PUBLIC_BOARD_LIMITS.pending})
     OR (status = 'preparing' AND board_rank <= ${PUBLIC_BOARD_LIMITS.preparing})
     OR (status = 'done' AND board_rank <= ${PUBLIC_BOARD_LIMITS.done})
  ORDER BY status, board_rank`;
