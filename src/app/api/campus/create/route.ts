import { CampusRepository } from '@/feature/multi-tenancy/repositories/campus.repository';
import { createCampusSchema } from '@/feature/multi-tenancy/schema/campus.schema';
import { CampusService } from '@/feature/multi-tenancy/services/campus.service';
import { apiErrorHandler, requiredSession } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const POST = apiErrorHandler(
  async (req: NextRequest) => {
    const body = await req.json();
    const values = createCampusSchema.parse(body);

    const result = await campusService.createCampus(values);

    return NextResponse.json(result, { status: 200 });
  },
  {
    guards: [requiredSession],
  }
);
