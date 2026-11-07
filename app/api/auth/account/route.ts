import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('orderly_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'You must be signed in to delete your account.' }, { status: 401 });
  }

  let userId: number;
  try {
    const payload = verifyToken(token);
    if (!Number.isSafeInteger(payload.id) || payload.id < 1) {
      return NextResponse.json({ message: 'Your session is invalid. Please sign in again.' }, { status: 401 });
    }
    userId = payload.id;
  } catch {
    return NextResponse.json({ message: 'Your session is invalid. Please sign in again.' }, { status: 401 });
  }

  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (!result.rows[0]) {
      return NextResponse.json({ message: 'This account no longer exists.' }, { status: 404 });
    }

    const response = NextResponse.json({ message: 'Your account has been deleted.' }, { status: 200 });
    response.cookies.set('orderly_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('account deletion error', error);
    return NextResponse.json({ message: 'Unable to delete your account right now.' }, { status: 500 });
  }
}
