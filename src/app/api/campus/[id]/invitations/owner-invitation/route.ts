import { CampusRepository } from '@/feature/campus/repositories/campus.repository';
import { createOwnerInvitationSchema } from '@/feature/campus/schema/invitation.schema';
import { CampusInvitationService } from '@/feature/campus/services/invitation.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusInvitationService = new CampusInvitationService();

export const POST = apiErrorHandler(
  async (req) => {
    const body = await req.json();

    const parsedValues = createOwnerInvitationSchema.parse(body);

    // const campusOwner = await campusRepository.findCampusOwner(
    //   parsedValues.organizationId
    // );

    return NextResponse.json({}, { status: 200 });
  },
  { guards: [] }
);
