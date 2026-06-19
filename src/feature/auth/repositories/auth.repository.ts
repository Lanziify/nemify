import { SYSTEM_ROLES } from '@/data/permissions';
import { db } from '@/utils/db';

export const findUserByEmail = (email: string) => {
  return db
    .selectFrom('user')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();
};

export const assignSystemAdminRole = (id: string) => {
  return db
    .updateTable('user')
    .set({ platformRole: SYSTEM_ROLES.admin })
    .where('id', '=', id)
    .executeTakeFirstOrThrow();
};