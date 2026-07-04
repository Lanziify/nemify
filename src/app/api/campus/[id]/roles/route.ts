import { CampusRepository } from '@/feature/campus/repositories/campus.repository';
import {
  createCampusRoleSchema,
  updateCampusRoleSchema,
} from '@/feature/campus/schema/campus.schema';
import { CampusService } from '@/feature/campus/services/campus.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { DatabaseError, ServerError } from '@/lib/errors/app-error';
import { NoResultError } from 'kysely';
import { NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const GET = apiErrorHandler(
  async (req, { params }) => {
    const { id } = await params;

    let campus: Awaited<ReturnType<CampusRepository['findCampusById']>> | null =
      null;

    try {
      const campusQuery = await campusRepository.findCampusById(String(id));
      campus = campusQuery;
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new DatabaseError(`Could not find campus with id: ${id}`);
      }
    }

    if (!campus) throw new ServerError("Something wen't wrong!");

    const campusRoles = await campusService.getCampusRoles(campus?.id);

    return NextResponse.json(campusRoles, { status: 200 });
  },
  { guards: [] }
);

export const POST = apiErrorHandler(
  async (req) => {
    const body = await req.json();

    const parsedValues = createCampusRoleSchema.parse(body);

    const result = await campusService.createCampusRole(parsedValues);

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);

export const PATCH = apiErrorHandler(
  async (req) => {
    const body = await req.json();
    const parsedValues = updateCampusRoleSchema.parse(body);

    const result = await campusService.updateCampusRole(parsedValues);

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);
