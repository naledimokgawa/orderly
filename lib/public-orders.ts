/**
 * Columns that are safe to expose to guests and customer accounts:
 * the tracking number, status and the customer's first name only
 * (never the surname, description, date or staff details).
 */
export const PUBLIC_ORDER_COLUMNS = `id, status,
  split_part(regexp_replace(btrim(customer_name), '[[:space:]]+', ' ', 'g'), ' ', 1) AS customer_first_name`;

/**
 * Orders visible on the public board: everything pending or being prepared,
 * plus orders finished in the last 24 hours. Cancelled orders are never shown.
 */
export const PUBLIC_ORDER_FILTER = `(status IN ('pending', 'preparing')
  OR (status = 'done' AND updated_at > NOW() - INTERVAL '24 hours'))`;
