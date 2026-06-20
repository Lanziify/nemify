import { auth } from '@/utils/auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';

export const createCampusOrganization = async (
  values: CreateOrganizationBody
) => {
  const { status: isSlugAvalilable } = await auth.api.checkOrganizationSlug({
    body: {
      slug: values.slug,
    },
  });

  if (!isSlugAvalilable) {
    throw new APIError('BAD_REQUEST', {
      message: 'Campus slug is already taken. Please choose another one.',
    });
  }

  const data = await auth.api.createOrganization({
    body: values,
    headers: await headers(),
  });

  return data;
};

export const getUserCampusOrganization = async () => {
  const campus = await auth.api.getFullOrganization({
    headers: await headers(),
  });
};

export type CreateOrganizationBody = NonNullable<
  Parameters<typeof auth.api.createOrganization>[0]
>['body'];
