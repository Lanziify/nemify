import { auth } from '@/utils/auth';
import { CampusRepository } from '../repositories/campus.repository';
import { BadRequestError, DatabaseError } from '@/lib/errors/app-error';
import { headers } from 'next/headers';
import { NoResultError } from 'kysely';

export class CampusService {
  constructor(private campusRepo: CampusRepository) {}

  async createCampus(values: CreateOrganizationBody) {
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
}

export type CampusWithRegisteredCount = Awaited<
  ReturnType<CampusService['getAllCampus']>
>[0];

export type CreateOrganizationBody = NonNullable<
  Parameters<typeof auth.api.createOrganization>[0]
>['body'];
