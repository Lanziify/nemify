import { CampusRepository } from '@/feature/multi-tenancy/repositories/campus.repository';
import { createUserInvitationSchema } from '@/feature/multi-tenancy/schema/campus.schema';
import { CampusService } from '@/feature/multi-tenancy/services/campus.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const POST = apiErrorHandler(
  async (req) => {
    const body = await req.json();

    const parsedValues = createUserInvitationSchema.parse(body)

    const result = await campusService.createUserInvitation(parsedValues)

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);
