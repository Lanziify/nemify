import { Kysely } from 'kysely';
import { db } from './db';
import { Database } from '@/types/db.schema';

export async function up(db: Kysely<Database>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Migration code
}
