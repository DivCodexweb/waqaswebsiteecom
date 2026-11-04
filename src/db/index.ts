import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Local file ke liye absolute ya relative path properly format karna
const databaseUrl = process.env.TURSO_DATABASE_URL || 'file:./local.db';

const client = createClient({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });