import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/admin-auth';
import { query } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const authorizationError = await requireAdmin(request);
  if (authorizationError) return authorizationError;

  try {
    const result = await query(
      "SELECT id, name, email, role, created_at FROM users WHERE role = 'staff' ORDER BY name ASC"
    );

    return NextResponse.json({ staff: result.rows }, { status: 200 });
  } catch (error) {
    console.error('fetch staff error', error);
    return NextResponse.json({ message: 'Unable to load staff members.' }, { status: 500 });
  }
}
