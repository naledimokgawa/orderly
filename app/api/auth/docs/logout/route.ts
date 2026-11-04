import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Docs access revoked.' }, { status: 200 });
  response.cookies.set('orderly_docs_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
