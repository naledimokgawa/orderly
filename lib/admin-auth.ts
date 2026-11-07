import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from './request-auth';

export async function requireAdmin(request: NextRequest) {
  const authentication = await authenticateRequest(request);
  if (!authentication.ok) return authentication.response;
  if (authentication.user.role === 'admin') return null;

  return NextResponse.json({ message: 'You do not have permission to view this list.' }, { status: 403 });
}
