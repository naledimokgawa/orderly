import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../lib/request-auth';
import { query } from '../../../lib/db';
import { PUBLIC_ORDER_COLUMNS } from '../../../lib/public-orders';

async function publicOrdersResponse() {
  try {
    const result = await query(
      `SELECT ${PUBLIC_ORDER_COLUMNS}
       FROM orders
       WHERE status = 'preparing'
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ orders: result.rows }, { status: 200 });
  } catch (error) {
    console.error('fetch public orders error', error);
    return NextResponse.json(
      { message: 'Unable to load current orders.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('public') === 'true') {
    return publicOrdersResponse();
  }

  const authentication = await authenticateRequest(request);
  if (!authentication.ok && authentication.response.status !== 401)
    return authentication.response;

  // Guests and customer accounts only see the public view.
  if (!authentication.ok || authentication.user.role === 'user') {
    return publicOrdersResponse();
  }

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
    return NextResponse.json(
      { message: 'Unable to load orders.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authentication = await authenticateRequest(request);
  if (!authentication.ok) return authentication.response;
  if (authentication.user.role === 'user') {
    return NextResponse.json(
      { message: 'Only staff and admins can create orders.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { message: 'Request body must be a JSON object.' },
        { status: 400 }
      );
    }

    const customerName = String(body.customerName || '').trim();
    const description = String(body.description || '').trim();
    const orderDate = String(body.orderDate || '').trim();

    if (!customerName || !description || !orderDate) {
      return NextResponse.json(
        { message: 'Customer name, description, and order date are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO orders (customer_name, description, order_date, status, created_by)
       VALUES ($1, $2, $3, 'preparing', $4)
       RETURNING *`,
      [customerName, description, orderDate, authentication.user.id]
    );

    return NextResponse.json({ order: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }
    console.error('create order error', error);
    return NextResponse.json(
      { message: 'Unable to create order.' },
      { status: 500 }
    );
  }
}
