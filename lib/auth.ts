import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export type UserRole = 'admin' | 'staff';

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export const JWT_SECRET = process.env.JWT_SECRET || 'orderly-dev-secret';

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
  return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: UserRole };
}

export function sanitizeUser(user: Record<string, any>): SafeUser {
  return {
    id: Number(user.id),
    name: String(user.name || ''),
    email: String(user.email || ''),
    role: String(user.role || 'staff') as UserRole,
  };
}
