import { AuthRepository } from '../repositories/auth.repository';
import { SignUpEmailValues } from '../schema/auth.schema';
import { auth } from '@/utils/auth';
import { DatabaseError } from '@/lib/errors/app-error';
import { PLATFORM_ROLES } from '@/lib/auth/roles';

export class AuthService {
  constructor(private repository: AuthRepository) {}

  async createFirstAdmin(values: SignUpEmailValues) {
    const isAdminExists = await this.repository.adminExists();

    if (isAdminExists) {
      throw new DatabaseError(
        `Could not initialize admin. Admin already exist`
      );
    }

    const response = await auth.api.signUpEmail({ body: values });

    await this.repository.setUserRole(response.user.id, PLATFORM_ROLES.admin);

    return response;
  }
}
