import { neon } from '@neondatabase/serverless';

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is missing in Vercel settings.');
  }
  return neon(connectionString);
}

export const sql = function(...args) {
  const db = getDb();
  return db(...args);
};

export default getDb;