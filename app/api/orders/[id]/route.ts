import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/request-auth';
import { query } from '../../../../lib/db';

function parseOrderId(id: string) {
  const parsedId = Number(id);
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authentication = await authenticateRequest(request);
  if (!authentication.ok) return authentication.response;

  const { id } = await params;
  const orderId = parseOrderId(id);
  if (orderId === null) {
    return NextResponse.json({ message: 'Invalid order ID.' }, { status: 400 });
  }

  try {
    if (authentication.user.role === 'user') {
      const result = await query(
        `SELECT id, status
         FROM orders
         WHERE id = $1 AND status = 'preparing'`,
        [orderId]
      );

      if (!result.rows[0]) {
        return NextResponse.json(
          { message: 'Order not found.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ order: result.rows[0] }, { status: 200 });
    }

    const result = await query('SELECT * FROM orders WHERE id = $1', [orderId]);

    if (!result.rows[0]) {
      return NextResponse.json(
        { message: 'Order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('fetch order error', error);
    return NextResponse.json(
      { message: 'Unable to load order.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authentication = await authenticateRequest(request);
  if (!authentication.ok) return authentication.response;
  if (authentication.user.role === 'user') {
    return NextResponse.json(
      { message: 'Only staff and admins can update orders.' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const orderId = parseOrderId(id);
  if (orderId === null) {
    return NextResponse.json({ message: 'Invalid order ID.' }, { status: 400 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { message: 'Request body must be a JSON object.' },
      { status: 400 }
    );
  }

  const fields: string[] = [];
  const values: (string | number | Date | boolean | null)[] = [];
  let index = 1;

  if (body.status !== undefined) {
    if (
      body.status !== 'preparing' &&
      body.status !== 'done' &&
      body.status !== 'cancelled'
    ) {
      return NextResponse.json(
        { message: 'Invalid order status.' },
        { status: 400 }
      );
    }
    fields.push(`status = $${index}`);
    values.push(body.status);
    index += 1;
  }

  if (body.customerName !== undefined) {
    if (typeof body.customerName !== 'string' || !body.customerName.trim()) {
      return NextResponse.json(
        { message: 'Customer name must not be empty.' },
        { status: 400 }
      );
    }
    fields.push(`customer_name = $${index}`);
    values.push(body.customerName.trim());
    index += 1;
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string' || !body.description.trim()) {
      return NextResponse.json(
        { message: 'Description must not be empty.' },
        { status: 400 }
      );
    }
    fields.push(`description = $${index}`);
    values.push(body.description.trim());
    index += 1;
  }

  if (body.orderDate !== undefined) {
    if (
      typeof body.orderDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.orderDate)
    ) {
      return NextResponse.json(
        { message: 'Order date must be a valid YYYY-MM-DD date.' },
        { status: 400 }
      );
    }
    fields.push(`order_date = $${index}`);
    values.push(body.orderDate);
    index += 1;
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { message: 'No valid fields were supplied.' },
      { status: 400 }
    );
  }

  try {
    const result = await query(
      `UPDATE orders SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`,
      [...values, orderId]
    );

    if (!result.rows[0]) {
      return NextResponse.json(
        { message: 'Order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('update order error', error);
    return NextResponse.json(
      { message: 'Unable to update order.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authentication = await authenticateRequest(request);
  if (!authentication.ok) return authentication.response;
  if (authentication.user.role === 'user') {
    return NextResponse.json(
      { message: 'Only staff and admins can delete orders.' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const orderId = parseOrderId(id);
  if (orderId === null) {
    return NextResponse.json({ message: 'Invalid order ID.' }, { status: 400 });
  }

  try {
    const result = await query('DELETE FROM orders WHERE id = $1 RETURNING *', [
      orderId,
    ]);

    if (!result.rows[0]) {
      return NextResponse.json(
        { message: 'Order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Order deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('delete order error', error);
    return NextResponse.json(
      { message: 'Unable to delete order.' },
      { status: 500 }
    );
  }
}
