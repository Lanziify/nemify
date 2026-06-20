import { PLATFORM_ROLES } from '@/data/roles';
import { User } from '@/db/db';
import { db } from '@/utils/db';
import type { Selectable } from 'kysely';

export const checkSystemAdministrationRole = (
  id: string
): Promise<Selectable<User>> => {
  return db
    .selectFrom('user')
    .selectAll()
    .where('id', '=', id)
    .where('platformRole', '=', PLATFORM_ROLES.admin)
    .executeTakeFirstOrThrow();
};

export const checkSystemUserRole = (
  id: string
): Promise<Selectable<User>> => {
  return db
    .selectFrom('user')
    .selectAll()
    .where('id', '=', id)
    .where('platformRole', '=', PLATFORM_ROLES.user)
    .executeTakeFirstOrThrow();
};
