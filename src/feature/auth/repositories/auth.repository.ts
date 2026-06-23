import { PlatformRole } from '@/data/roles';
import { db } from '@/utils/db';
import { sql } from 'kysely';

export const findUserByEmail = (email: string) => {
  return db
    .selectFrom('user')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();
};

export const setUserPlatformRole = (id: string, role: PlatformRole) => {
  return db
    .updateTable('user')
    .set({ platformRole: role })
    .where('id', '=', id)
    .executeTakeFirstOrThrow();
};

/**
 * TODO: Maybe separate these functions to another feature folder
 */
export const getPlatformInitState = () => {
  return db
    .selectFrom('platform')
    .select('initialized')
    .where('id', '=', 1)
    .executeTakeFirstOrThrow();
};

export const updatePlatformInitState = (userId: string) => {
  return db
    .updateTable('platform')
    .set({
      initialized: true,
      initializedBy: userId,
      initializedAt: sql`now()`,
    })
    .where('id', '=', 1)
    .executeTakeFirstOrThrow();
};
