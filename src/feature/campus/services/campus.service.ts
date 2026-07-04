import { auth } from '@/utils/auth';
import { CampusRepository } from '../repositories/campus.repository';
import { BadRequestError, DatabaseError } from '@/lib/errors/app-error';
import { headers } from 'next/headers';
import { NoResultError } from 'kysely';

export class CampusService {
  constructor(private repository: CampusRepository) {}
  //#region Utilities
  private async currentHeaders() {
    return await headers();
  }
  //#endregion

  //#region Cration
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
      headers: await this.currentHeaders(),
    });

    const activeCampus = await auth.api.setActiveOrganization({
      body: {
        organizationId: campus.id,
        organizationSlug: campus.slug,
      },
      headers: await this.currentHeaders(),
    });

    return activeCampus;
  }

  async createCampusRole(values: CreateCampusRoleBody) {
    return await auth.api.createOrgRole({
      body: values,
      headers: await this.currentHeaders(),
    });
  }

  async createCampusInvitation(values: CreateCampusInvitationBody) {
    return await auth.api.createInvitation({
      body: values,
      headers: await this.currentHeaders(),
    });
  }

  async createCampusDepartment(name: string, campusId: string) {
    return await auth.api.createTeam({
      body: {
        name,
        organizationId: campusId,
      },
      headers: await this.currentHeaders(),
    });
  }
  //#endregion

  //#region Gets
  async getAllCampus() {
    return this.repository.findAll();
  }

  async getCampus(query: GetCampusQuery) {
    return await auth.api.getFullOrganization({
      query,
      headers: await this.currentHeaders(),
    });
  }

  async getCampusBySlug(slug: string) {
    try {
      const query = await this.repository.findCampusBySlug(slug);

      return query;
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new DatabaseError(`Could not find campus with slug: ${slug}`);
      }
    }
  }

  async getCampusRoles(id: string) {
    return await auth.api.listOrgRoles({
      query: { organizationId: id },
      headers: await this.currentHeaders(),
    });
  }

  async getCampusMembers(query: GetCampusMembersQuery) {
    return await auth.api.listMembers({
      query,
      headers: await this.currentHeaders(),
    });
  }

  async getCampusDepartments(campusId: string) {
    return await auth.api.listOrganizationTeams({
      query: {
        organizationId: campusId,
      },
      headers: await this.currentHeaders(),
    });
  }
  //#endregion

  //#region Updates
  async updateCampusRole(values: UpdateCampusRoleBody) {
    return await auth.api.updateOrgRole({
      body: values,
      headers: await this.currentHeaders(),
    });
  }
  //#endregion

  //#region Accepts
  async acceptCampusInvitation(id: string) {
    return await auth.api.acceptInvitation({
      body: {
        invitationId: id,
      },
      headers: await this.currentHeaders(),
    });
  }
  //#endregion
}

//#region Create Types
export type CreateCampusBody = NonNullable<
  Parameters<typeof auth.api.createOrganization>[0]
>['body'];

export type CreateCampusServiceResponse = Awaited<
  ReturnType<CampusService['createCampus']>
>;

export type CreateCampusRoleBody = NonNullable<
  Parameters<typeof auth.api.createOrgRole>[0]
>['body'];

export type CreateCampusRoleServiceResult = Awaited<
  ReturnType<CampusService['createCampusRole']>
>;

export type CreateCampusInvitationBody = NonNullable<
  Parameters<typeof auth.api.createInvitation>[0]
>['body'];

export type CreateCampusInvitationServiceResult = Awaited<
  ReturnType<CampusService['createCampusInvitation']>
>;

export type CreateCampusDepartmentServiceResult = Awaited<
  ReturnType<CampusService['createCampusDepartment']>
>;
//#endregion

//#region Get Types
export type GetAllCampusServiceResponse = Awaited<
  ReturnType<CampusService['getAllCampus']>
>;

export type GetCampusQuery = NonNullable<
  Parameters<typeof auth.api.getFullOrganization>[0]
>['query'];

export type GetCampusServiceResponse = Awaited<
  ReturnType<CampusService['getCampus']>
>;

export type GetCampusBySlugServiceResponse = Awaited<
  ReturnType<CampusService['getCampusBySlug']>
>;

export type GetCampusRoleServiceResult = Awaited<
  ReturnType<CampusService['getCampusRoles']>
>;

export type GetCampusMembersQuery = NonNullable<
  Parameters<typeof auth.api.listMembers>[0]
>['query'];

export type GetCampusMembersServiceResult = Awaited<
  ReturnType<CampusService['getCampusMembers']>
>;

export type GetCampusDepartmentsServiceResult = Awaited<
  ReturnType<CampusService['getCampusDepartments']>
>;
//#endregion

//#region Update Typse
export type UpdateCampusRoleBody = NonNullable<
  Parameters<typeof auth.api.updateOrgRole>[0]
>['body'];

export type UpdateCampusRoleServiceResult = Awaited<
  ReturnType<CampusService['updateCampusRole']>
>;
//#endregion

//#region Accept Types
export type AcceptCampusInvitationServiceResult = Awaited<
  ReturnType<CampusService['acceptCampusInvitation']>
>;
//#endregion
