'use server';

import { auth } from '@/utils/auth';
import { SignInEmailPasswordValues } from '../schema/auth.schema';
import { actionErrorParser } from '@/lib/errors/action-error-parser';
import { safeCatch } from '@/lib/errors/safe-catch';
import { headers } from 'next/headers';

// Server action used in client
export const signInUserAccount = async (values: SignInEmailPasswordValues) => {
  return await safeCatch(
    async () => {
      return await auth.api.signInEmail({ body: values });
    },
    { parser: actionErrorParser }
  );
};

export const signOutUserAccount = async () => {
  return await safeCatch(
    async () => {
      return await auth.api.signOut({
        headers: await headers(),
      });
    },
    { parser: actionErrorParser }
  );
};
