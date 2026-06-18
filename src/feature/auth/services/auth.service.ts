import { NoResultError } from 'kysely';
import { assignSystemAdminRole } from '../repositories/auth.repository';
import { SignUpEmailValues } from '../schema/auth.schema';
import { auth } from '@/utils/auth';
import { APIError } from 'better-auth/api';

export const createSystemAdminAccount = async (values: SignUpEmailValues) => {
  // const admin = await auth.api.signUpEmail({ body: values });
  const result = await assignSystemAdminRole('hello world');

  if (result.numUpdatedRows === BigInt(0)) {
    throw new APIError('NOT_FOUND', {
      message: 'Cannot assign role. User does not exist.',
      code: 'NOT_FOUND ',
    });
  }
  // return admin;
};
