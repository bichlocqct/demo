import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

export const usePostgres = !!connectionString;

let pool = null;

if (usePostgres) {
  // Use a global variable to persist the pool across Next.js dev hot-reloads
  if (!global.pgPool) {
    global.pgPool = new Pool({
      connectionString,
      // Supabase pooler requires SSL connection
      ssl: {
        rejectUnauthorized: false
      },
      // Keep connection configuration optimal for serverless
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });
  }
  pool = global.pgPool;
}

export { pool };
