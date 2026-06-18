import { DB } from '@/db/db';
import type { Kysely } from 'kysely';

// replace `any` with your database interface.
export async function seed(db: Kysely<DB>): Promise<void> {
  const trx = await db.startTransaction().execute();

  try {
  } catch (error) {
    await trx.rollback();
  }
}
