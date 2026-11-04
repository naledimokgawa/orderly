import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('orderly_token')?.value;
  const docsSession = request.cookies.get('orderly_docs_session')?.value;

  if (token) {
    try {
      const payload = verifyToken(token);
      return NextResponse.json({ user: payload }, { status: 200 });
    } catch {
      // fall through to docs session check below
    }
  }

  if (docsSession === 'authenticated') {
    return NextResponse.json(
      {
        user: {
          id: 'docs-admin',
          email: process.env.DOCS_USERNAME || 'admin',
          role: 'admin',
        },
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ user: null }, { status: 200 });
}
