import { CampusInvitationService } from '@/feature/multi-tenancy/services/invitation.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';


const campusInvitationService = new CampusInvitationService()

export const GET = apiErrorHandler(
  async (_, { params }) => {
    const { id } = await params;

    const result = await campusInvitationService.getCampusInvitation(id as string);

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);
