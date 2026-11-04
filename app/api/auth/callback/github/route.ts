import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { hashPassword, sanitizeUser, signToken } from '../../../../../lib/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=github-auth-failed`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri =
    process.env.GITHUB_REDIRECT_URI && origin.includes('localhost')
      ? process.env.GITHUB_REDIRECT_URI
      : process.env.GITHUB_REDIRECT_URI_VERCEL && !origin.includes('localhost')
        ? process.env.GITHUB_REDIRECT_URI_VERCEL
        : `${origin}/api/auth/callback/github`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/login?error=oauth-not-configured`);
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(`${origin}/login?error=oauth-token-missing`);
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const githubUser = await userResponse.json();
    const githubEmail = githubUser.email || `${githubUser.login}@github.user`;

    const existing = await query('SELECT id, name, email, role FROM users WHERE LOWER(email) = LOWER($1)', [githubEmail]);

    let userRow = existing.rows[0];
    if (!userRow) {
      const result = await query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [githubUser.name || githubUser.login || 'GitHub User', githubEmail, await hashPassword(`github-${Date.now()}`), 'staff']
      );
      userRow = result.rows[0];
    }

    const safeUser = sanitizeUser(userRow);
    const token = signToken({ id: userRow.id, email: userRow.email, role: userRow.role });

    const response = NextResponse.redirect(`${origin}/dashboard`);
    response.cookies.set('orderly_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    response.headers.set('x-orderly-user', JSON.stringify(safeUser));

    return response;
  } catch (error) {
    console.error('GitHub callback error', error);
    return NextResponse.redirect(`${origin}/login?error=oauth-failed`);
  }
}
