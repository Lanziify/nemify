import { assignSystemAdminRole } from '../repositories/auth.repository';
import { SignUpEmailValues } from '../schema/auth.schema';
import { auth } from '@/utils/auth';
import { DatabaseError } from '@/lib/errors/app-error';

export const createSystemAdminAccount = async (values: SignUpEmailValues) => {
  const admin = await auth.api.signUpEmail({ body: values });

  const result = await assignSystemAdminRole(admin.user.id);

  if (result.numUpdatedRows === BigInt(0)) {
    throw new DatabaseError('Cannot assign role. User does not exist.');
  }

  return admin;
};
