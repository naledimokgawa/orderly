import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/request-auth';

export async function GET(request: NextRequest) {
  const authentication = await authenticateRequest(request);
  if (authentication.ok) {
    const user = authentication.user.id === null
      ? { ...authentication.user, id: 'docs-admin' }
      : authentication.user;
    return NextResponse.json({ user }, { status: 200 });
  }

  if (authentication.response.status === 401) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return authentication.response;
}
