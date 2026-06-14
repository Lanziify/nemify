import { DB } from '@/db/db';
import { Database } from '@/db/schema';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});
