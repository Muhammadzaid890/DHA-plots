import { neon, neonConfig } from '@neondatabase/serverless';

// Ensure fetch and ssl mode works seamlessly in Next.js Serverless API routes
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL || '';

export const sql = neon(connectionString);