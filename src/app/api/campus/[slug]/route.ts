import { CampusRepository } from '@/feature/multi-tenancy/repositories/campus.repository';
import { CampusService } from '@/feature/multi-tenancy/services/campus.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const GET = apiErrorHandler(async (req: NextRequest, { params }) => {
  const { slug } = await params;

  const query = await campusService.getCampusBySlug(slug as string);

  return NextResponse.json(query, { status: 200 });
});
