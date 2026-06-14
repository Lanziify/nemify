import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const deparmentTable = await db.schema
    .createTable('department')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar');

  await Promise.all(
    [deparmentTable].map((builder) => {
      builder.execute();
    })
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  const deparmentTable = await db.schema.dropType('department');

  await Promise.all(
    [deparmentTable].map((builder) => {
      builder.execute();
    })
  );
}
