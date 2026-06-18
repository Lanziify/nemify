import type { Kysely } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('department')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('name', 'varchar')
    .addColumn('slug', 'varchar')
    .addColumn('campusId', 'text')
    .addForeignKeyConstraint('department_campus_fk', ['campusId'], 'campus', [
      'id',
    ])
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('department').cascade().execute();
}
