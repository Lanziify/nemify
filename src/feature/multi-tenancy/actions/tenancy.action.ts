'use server';

import { actionErrorParser } from '@/lib/errors/action-error-parser';
import { safeCatch } from '@/lib/errors/safe-catch';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';

export const getUserCampusList = async () => {
  return await safeCatch(
    async () => {
      return await auth.api.listOrganizations({
        headers: await headers(),
      });
    },
    { parser: actionErrorParser }
  );
};
