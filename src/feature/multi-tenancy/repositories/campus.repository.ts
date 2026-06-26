import { db } from '@/utils/db';

export class CampusRepository {
  async findAll() {
    return db
      .selectFrom('campus')
      .leftJoin('campusMember', 'campusMember.campusId', 'campus.id')
      .selectAll('campus')
      .select((eb) => [
        eb.fn.count<number>('campusMember.id').as('registeredMembers'),
      ])
      .groupBy('campus.id')
      .execute();
  }

  async findCampusById(id: string) {
    return db
      .selectFrom('campus')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async findCampusBySlug(slug: string) {
    return db
      .selectFrom('campus')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirstOrThrow();
  }
}

export class CampusPolicy {}
