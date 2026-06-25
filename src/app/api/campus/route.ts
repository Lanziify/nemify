import { CampusRepository } from '@/feature/multi-tenancy/repositories/campus.repository';
import { createOrganizationSchema } from '@/feature/multi-tenancy/schema/campus.schema';
import { CampusService } from '@/feature/multi-tenancy/services/campus.service';
import {
  apiErrorHandler,
  requiredSession,
  requiredSystemAdministration,
} from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const POST = apiErrorHandler(
  async (req: NextRequest) => {
    const body = await req.json();
    const values = createOrganizationSchema.parse(body);

    // const isUserAlreadyInCampus = await getUserCampusData(req.headers)

    const result = await campusService.createCampus(values);

    return NextResponse.json(result, { status: 200 });
  },
  {
    guards: [requiredSession, requiredSystemAdministration],
  }
);

export const GET = apiErrorHandler(async (req: NextRequest) => {
  const query = await campusService.getAllCampus();

  return NextResponse.json(query, { status: 200 });
});
