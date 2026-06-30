import { CampusInvitationService } from '@/feature/multi-tenancy/services/invitation.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';


const campusInvitationService = new CampusInvitationService()

export const POST = apiErrorHandler(
  async (_, { params }) => {
    const { id } = await params;

    const result = campusInvitationService.acceptCampusInvitation(String(id));

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);
