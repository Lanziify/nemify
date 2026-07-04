import { CampusRepository } from '@/feature/campus/repositories/campus.repository';
import { createCampusSchema } from '@/feature/campus/schema/campus.schema';
import { CampusService } from '@/feature/campus/services/campus.service';
import { apiErrorHandler, requiredSession } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const GET = apiErrorHandler(async (req: NextRequest) => {
  const query = await campusService.getAllCampus();

  return NextResponse.json(query, { status: 200 });
});
