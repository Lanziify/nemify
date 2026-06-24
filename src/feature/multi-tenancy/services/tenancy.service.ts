import { auth } from '@/utils/auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';

export const createCampusOrganization = async (
  values: CreateOrganizationBody
) => {
  const { status: isSlugAvailable } = await auth.api.checkOrganizationSlug({
    body: {
      slug: values.slug,
    },
  });

  if (!isSlugAvailable) {
    throw new APIError('BAD_REQUEST', {
      message: 'Campus slug is already taken. Please choose another one.',
    });
  }

  const campus = await auth.api.createOrganization({
    body: values,
    headers: await headers(),
  });

  const activeCampus = await auth.api.setActiveOrganization({
    body: {
      organizationId: campus.id,
      organizationSlug: campus.slug,
    },
    headers: await headers(),
  });

  return activeCampus;
};

export const getUserCampusOrganization = async () => {
  const campus = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  return campus;
};

export type CreateOrganizationBody = NonNullable<
  Parameters<typeof auth.api.createOrganization>[0]
>['body'];
