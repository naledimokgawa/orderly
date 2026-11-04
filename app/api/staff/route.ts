import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY name ASC'
    );

    return NextResponse.json({ staff: result.rows }, { status: 200 });
  } catch (error) {
    console.error('fetch staff error', error);
    return NextResponse.json({ message: 'Unable to load staff members.' }, { status: 500 });
  }
}
