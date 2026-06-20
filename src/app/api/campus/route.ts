import { createOrganizationSchema } from '@/feature/multi-tenancy/schema/tenancy.schema';
import { createCampusOrganization } from '@/feature/multi-tenancy/services/tenancy.service';
import {
  apiErrorHandler,
  requiredSession,
  requiredSystemAdministration,
} from '@/lib/api-handler';
import { NextRequest, NextResponse } from 'next/server';

export const POST = apiErrorHandler(
  async (req: NextRequest) => {
    const body = await req.json();
    const values = createOrganizationSchema.parse(body);

    // const isUserAlreadyInCampus = await getUserCampusData(req.headers)

    const campus = await createCampusOrganization(values);

    return NextResponse.json(campus, { status: 200 });
  },
  {
    guards: [requiredSession, requiredSystemAdministration],
  }
);
