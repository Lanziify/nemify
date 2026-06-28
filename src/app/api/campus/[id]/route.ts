import { CampusRepository } from '@/feature/multi-tenancy/repositories/campus.repository';
import { CampusService } from '@/feature/multi-tenancy/services/campus.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const GET = apiErrorHandler(async (req) => {
  

  return NextResponse.json({}, { status: 200 });
});
