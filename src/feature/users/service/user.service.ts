import { auth } from '@/utils/auth';
import { UserRepository } from '../reposiitory/user.repository';
import { headers } from 'next/headers';

export class UserService {
  constructor(private repository: UserRepository) {}

  async getUsersList(query: GetUsersListQuery) {
    return auth.api.listUsers({
      query,
      headers: await headers(),
    });
  }
}

export type GetUsersListQuery = NonNullable<
  Parameters<typeof auth.api.listUsers>[0]
>['query'];

export type GetUsersListServiceResponse = Awaited<
  ReturnType<UserService['getUsersList']>
>;
