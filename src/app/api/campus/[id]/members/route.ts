import { CampusRepository } from '@/feature/multi-tenancy/repositories/campus.repository';
import { getCampusMembersQuerySchema } from '@/feature/multi-tenancy/schema/campus.schema';
import { CampusService } from '@/feature/multi-tenancy/services/campus.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';

const campusRepository = new CampusRepository();
const campusService = new CampusService(campusRepository);

export const GET = apiErrorHandler(
  async (req, { params }) => {
    const { id } = await params;

    const { searchParams } = new URL(req.url);

    const parsedValues = getCampusMembersQuerySchema.parse({
      organizationId: id ?? undefined,
      searchField: searchParams.get('searchField') ?? undefined,
      searchOperator: searchParams.get('searchOperator') ?? undefined,

      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,

      sortBy: searchParams.get('sortBy') ?? undefined,
      sortDirection: searchParams.get('sortDirection') ?? undefined,

      filterField: searchParams.get('filterField') ?? undefined,
      filterValue: searchParams.get('filterValue') ?? undefined,
      filterOperator: searchParams.get('filterOperator') ?? undefined,
    });

    const result = await campusService.getCampusMembers(parsedValues);

    return NextResponse.json(result, { status: 200 });
  },
  { guards: [] }
);
