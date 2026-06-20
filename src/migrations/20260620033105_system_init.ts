import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('platform')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('initialized', 'boolean', (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn('initializedAt', 'timestamptz')
    .addColumn('initializedBy', 'text')
    .execute();

  await db
    .insertInto('platform')
    .values({
      id: 1,
      initialized: false,
    })
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('platform').execute();
}
