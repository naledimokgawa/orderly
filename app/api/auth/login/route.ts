import { NextResponse } from 'next/server';
import { comparePassword, sanitizeUser, signToken } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const result = await query(
      'SELECT id, name, email, password_hash, role FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const safeUser = sanitizeUser(user);
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({ user: safeUser, token }, { status: 200 });

    response.cookies.set('orderly_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('login error', error);
    return NextResponse.json({ message: 'Unable to sign in right now.' }, { status: 500 });
  }
}
