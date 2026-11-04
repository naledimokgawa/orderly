import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT o.*, u.name AS created_by_name
       FROM orders o
       LEFT JOIN users u ON u.id = o.created_by
       ORDER BY o.created_at DESC`
    );

    return NextResponse.json({ orders: result.rows }, { status: 200 });
  } catch (error) {
    console.error('fetch orders error', error);
    return NextResponse.json({ message: 'Unable to load orders.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = String(body.customerName || '').trim();
    const description = String(body.description || '').trim();
    const orderDate = String(body.orderDate || '').trim();

    if (!customerName || !description || !orderDate) {
      return NextResponse.json({ message: 'Customer name, description, and order date are required.' }, { status: 400 });
    }

    const createdByHeader = request.headers.get('x-user-id');
    const createdBy = createdByHeader ? Number(createdByHeader) : 2;

    const result = await query(
      `INSERT INTO orders (customer_name, description, order_date, status, created_by)
       VALUES ($1, $2, $3, 'preparing', $4)
       RETURNING *`,
      [customerName, description, orderDate, createdBy]
    );

    return NextResponse.json({ order: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('create order error', error);
    return NextResponse.json({ message: 'Unable to create order.' }, { status: 500 });
  }
}
