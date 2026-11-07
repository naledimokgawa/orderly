import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export type UserRole = 'admin' | 'staff' | 'user';

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export const JWT_SECRET = process.env.JWT_SECRET || 'orderly-dev-secret';

function normalizeRole(role: unknown): UserRole {
  return role === 'admin' || role === 'staff' ? role : 'user';
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { id: number; email: string; role?: unknown };
  return {
    id: payload.id,
    email: payload.email,
    role: normalizeRole(payload.role),
  };
}

export function signDocsToken() {
  return jwt.sign({ purpose: 'orderly-api-docs', role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyDocsToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { purpose?: unknown; role?: unknown };
    return payload.purpose === 'orderly-api-docs' && payload.role === 'admin';
  } catch {
    return false;
  }
}

export function sanitizeUser(user: Record<string, unknown>): SafeUser {
  return {
    id: Number(user.id),
    name: String(user.name || ''),
    email: String(user.email || ''),
    role: normalizeRole(user.role),
  };
}
