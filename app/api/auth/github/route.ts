import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const origin = new URL(request.url).origin;
  const redirectUri =
    process.env.GITHUB_REDIRECT_URI && origin.includes('localhost')
      ? process.env.GITHUB_REDIRECT_URI
      : process.env.GITHUB_REDIRECT_URI_VERCEL && !origin.includes('localhost')
        ? process.env.GITHUB_REDIRECT_URI_VERCEL
        : `${origin}/api/auth/callback/github`;

  if (!clientId) {
    return NextResponse.json({ message: 'GitHub OAuth is not configured yet.' }, { status: 500 });
  }

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'read:user user:email');

  return NextResponse.redirect(authUrl.toString());
}
