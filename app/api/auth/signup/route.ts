import { NextResponse } from 'next/server';
import { hashPassword, sanitizeUser } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ message: 'An account with that email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, 'staff']
    );

    return NextResponse.json({ user: sanitizeUser(result.rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('signup error', error);
    return NextResponse.json({ message: 'Unable to create account right now.' }, { status: 500 });
  }
}
