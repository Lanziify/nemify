import { DB } from '@/db/db';
import type { Kysely } from 'kysely'

// replace `any` with your database interface.
export async function seed(db: Kysely<DB>): Promise<void> {
	await db.deleteFrom('session').execute()
	await db.deleteFrom('account').execute()
	await db.deleteFrom('campus').execute()
	await db.deleteFrom('user').execute()
}
