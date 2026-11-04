import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Database features will be unavailable until it is configured.');
}

export const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('render.com')
      ? { rejectUnauthorized: false }
      : false,
});

export async function query<T extends Record<string, any> = Record<string, any>>(text: string, params?: any[]) {
  return pool.query<T>(text, params);
}
