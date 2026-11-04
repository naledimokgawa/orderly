import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await query('SELECT * FROM orders WHERE id = $1', [id]);

  if (!result.rows[0]) {
    return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json({ order: result.rows[0] }, { status: 200 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (body.status) {
    fields.push(`status = $${index}`);
    values.push(body.status);
    index += 1;
  }

  if (body.customerName) {
    fields.push(`customer_name = $${index}`);
    values.push(body.customerName);
    index += 1;
  }

  if (body.description) {
    fields.push(`description = $${index}`);
    values.push(body.description);
    index += 1;
  }

  if (body.orderDate) {
    fields.push(`order_date = $${index}`);
    values.push(body.orderDate);
    index += 1;
  }

  if (fields.length === 0) {
    return NextResponse.json({ message: 'No valid fields were supplied.' }, { status: 400 });
  }

  values.push(id);
  const result = await query(
    `UPDATE orders SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`,
    values
  );

  if (!result.rows[0]) {
    return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json({ order: result.rows[0] }, { status: 200 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

  if (!result.rows[0]) {
    return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Order deleted successfully.' }, { status: 200 });
}
