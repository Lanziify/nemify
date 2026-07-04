import { createCampusInvitationSchema } from '@/feature/campus/schema/invitation.schema';
import { CampusInvitationService } from '@/feature/campus/services/invitation.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';

const campusInvitationService = new CampusInvitationService();

export const POST = apiErrorHandler(
  async (req) => {
    const body = await req.json();

    const parsedValues = createCampusInvitationSchema.parse(body);

    const result =
      await campusInvitationService.createCampusInvitation(parsedValues);

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);
