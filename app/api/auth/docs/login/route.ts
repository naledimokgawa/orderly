import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    const expectedUsername = process.env.DOCS_USERNAME || 'admin';
    const expectedPassword = process.env.DOCS_PASSWORD || 'orderlydocs123';

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ message: 'Invalid docs credentials.' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Docs access granted.' }, { status: 200 });
    response.cookies.set('orderly_docs_session', 'authenticated', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error('docs login error', error);
    return NextResponse.json({ message: 'Unable to authenticate docs access.' }, { status: 500 });
  }
}
