import { auth } from '@/utils/auth';
import { CampusRepository } from '../repositories/campus.repository';
import { BadRequestError, DatabaseError } from '@/lib/errors/app-error';
import { headers } from 'next/headers';
import { NoResultError } from 'kysely';

export class CampusService {
  constructor(private campusRepo: CampusRepository) {}

  async createCampus(values: CreateCampusBody) {
    const { status: isSlugAvailable } = await auth.api.checkOrganizationSlug({
      body: {
        slug: values.slug,
      },
    });

    if (!isSlugAvailable) {
      throw new BadRequestError(
        'Campus slug is already taken. Please choose another one.'
      );
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
  }

  async getAllCampus() {
    return this.campusRepo.findAll();
  }

  async getCampus(query: GetCampuQuery) {
    return await auth.api.getFullOrganization({
      query,
      headers: await headers(),
    });
  }

  async getCampusBySlug(slug: string) {
    try {
      const query = await this.campusRepo.findCampusBySlug(slug);

      return query;
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new DatabaseError(`Could not find campus with slug: ${slug}`);
      }
    }
  }

  async createCampusRole(values: CreateCampusRoleBody) {
    return await auth.api.createOrgRole({
      body: values,
      headers: await headers(),
    });
  }

  async getCampusRoles(id: string) {
    return await auth.api.listOrgRoles({
      query: { organizationId: id },
      headers: await headers(),
    });
  }

  async updateCampusRole(values: UpdateCampusRoleBody) {
    return await auth.api.updateOrgRole({
      body: values,
      headers: await headers(),
    });
  }

  async createUserInvitation(values: CreateUserInviationBody) {
    return await auth.api.createInvitation({
      body: values,
      headers: await headers(),
    });
  }
}

export type GetAllCampusServiceResponse = Awaited<
  ReturnType<CampusService['getAllCampus']>
>;

export type CreateCampusBody = NonNullable<
  Parameters<typeof auth.api.createOrganization>[0]
>['body'];

export type CreateCampusServiceResponse = Awaited<
  ReturnType<CampusService['createCampus']>
>;

export type GetCampuQuery = NonNullable<
  Parameters<typeof auth.api.getFullOrganization>[0]
>['query'];

export type GetCampusServiceResponse = Awaited<
  ReturnType<CampusService['getCampus']>
>;

export type GetCampusBySlugServiceResponse = Awaited<
  ReturnType<CampusService['getCampusBySlug']>
>;

export type CreateCampusRoleBody = NonNullable<
  Parameters<typeof auth.api.createOrgRole>[0]
>['body'];

export type CreateCampusRoleServiceResult = Awaited<
  ReturnType<CampusService['createCampusRole']>
>;

export type UpdateCampusRoleBody = NonNullable<
  Parameters<typeof auth.api.updateOrgRole>[0]
>['body'];

export type CampusRoleServiceResult = Awaited<
  ReturnType<CampusService['getCampusRoles']>
>;

export type CreateUserInviationBody = NonNullable<
  Parameters<typeof auth.api.createInvitation>[0]
>['body'];

export type CreateUserInvitationServiceResult = Awaited<
  ReturnType<CampusService['createUserInvitation']>
>;
