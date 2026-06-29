import { UserRepository } from '@/feature/users/reposiitory/user.repository';
import { getUsersListQuerySchema } from '@/feature/users/schemaa/user.schema';
import { UserService } from '@/feature/users/service/user.service';
import { apiErrorHandler } from '@/lib/api-handler';
import { NextResponse } from 'next/server';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const GET = apiErrorHandler(
  async (req) => {
    const { searchParams } = new URL(req.url);

    const parsedValues = getUsersListQuerySchema.parse({
      searchValue: searchParams.get('searchValue') ?? undefined,
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

    const usersList = await userService.getUsersList(parsedValues);

    return NextResponse.json(usersList);
  },
  { guards: [] }
);
