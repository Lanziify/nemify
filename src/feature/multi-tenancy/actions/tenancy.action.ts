'use server';

import { actionErrorParser } from '@/lib/errors/action-error-parser';
import { safeCatch } from '@/lib/errors/safe-catch';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { createCampusOrganization } from '../services/tenancy.service';
import { createOrganizationSchema } from '../schema/tenancy.schema';

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

export const createCampus = async (values: unknown) => {
  return await safeCatch(
    async () => {
      const validated = createOrganizationSchema.parse(values);
      return await createCampusOrganization(validated);
    },
    { parser: actionErrorParser }
  );
};
