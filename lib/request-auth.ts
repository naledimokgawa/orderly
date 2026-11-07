import { NextRequest, NextResponse } from 'next/server';
import { UserRole, verifyDocsToken, verifyToken } from './auth';
import { query } from './db';

type AuthenticatedUser = {
  id: number | null;
  role: UserRole;
  name: string;
  email: string;
};

type AuthenticationResult =
  | { ok: true; user: AuthenticatedUser }
  | { ok: false; response: NextResponse };

export async function authenticateRequest(request: NextRequest): Promise<AuthenticationResult> {
  const token = request.cookies.get('orderly_token')?.value;

  if (token) {
    let tokenUser: ReturnType<typeof verifyToken> | null = null;
    try {
      tokenUser = verifyToken(token);
      if (!Number.isSafeInteger(tokenUser.id) || tokenUser.id < 1) {
        tokenUser = null;
      }
    } catch {
      tokenUser = null;
    }

    if (tokenUser) {
      try {
        const result = await query('SELECT id, name, email, role FROM users WHERE id = $1', [tokenUser.id]);
        const user = result.rows[0];

        if (user) {
          const role: UserRole = user.role === 'admin' || user.role === 'staff' ? user.role : 'user';
          return {
            ok: true,
            user: {
              id: Number(user.id),
              role,
              name: String(user.name),
              email: String(user.email),
            },
          };
        }
      } catch (error) {
        console.error('authentication user lookup error', error);
        return {
          ok: false,
          response: NextResponse.json({ message: 'Unable to verify your account right now.' }, { status: 500 }),
        };
      }
    }
  }

  const docsToken = request.cookies.get('orderly_docs_session')?.value;
  if (docsToken && verifyDocsToken(docsToken)) {
    return {
      ok: true,
      user: {
        id: null,
        role: 'admin',
        name: 'API Docs Admin',
        email: process.env.DOCS_USERNAME || 'admin',
      },
    };
  }

  return {
    ok: false,
    response: NextResponse.json({ message: 'You must be signed in to access orders.' }, { status: 401 }),
  };
}
