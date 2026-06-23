import {
  setUserPlatformRole,
  findUserByEmail,
} from '../repositories/auth.repository';
import { SignUpEmailValues } from '../schema/auth.schema';
import { auth } from '@/utils/auth';
import { BadRequestError, DatabaseError } from '@/lib/errors/app-error';
import { PlatformRole } from '@/data/roles';

export const createSystemAccount = async (options: {
  values: SignUpEmailValues;
  platformRole: PlatformRole;
}) => {
  const userWithExistingEmail = await findUserByEmail(options.values.email);

  if (userWithExistingEmail) {
    throw new BadRequestError('Cannot create user. Email is already taken.');
  }

  const admin = await auth.api.signUpEmail({ body: options.values });

  const result = await setUserPlatformRole(admin.user.id, options.platformRole);

  if (result.numUpdatedRows === BigInt(0)) {
    throw new DatabaseError('Cannot assign role. User does not exist.');
  }

  return admin;
};
