import { PlatformRole } from '@/lib/auth/roles';
import { db } from '@/utils/db';
import { sql } from 'kysely';

export const findUserByEmail = (email: string) => {
  return db
    .selectFrom('user')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();
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

export class AuthRepository {
  async adminExists() {
    return db
      .selectFrom('user')
      .selectAll()
      .where('role', '=', 'admin')
      .executeTakeFirst();
  }

  async setUserRole(userId: string, role: string) {
    return db
      .updateTable('user')
      .set({
        role: role,
      })
      .where('id', '=', userId)
      .executeTakeFirstOrThrow();
  }
}
