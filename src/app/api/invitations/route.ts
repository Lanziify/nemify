import { CampusRepository } from '@/feature/multi-tenancy/repositories/campus.repository';
import { createCampusInvitationSchema } from '@/feature/multi-tenancy/schema/invitation.schema';
import { CampusService } from '@/feature/multi-tenancy/services/campus.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const POST = apiErrorHandler(
  async (req) => {
    const body = await req.json();

    const parsedValues = createCampusInvitationSchema.parse(body);

    const result = await campusService.createCampusInvitation(parsedValues);

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);
