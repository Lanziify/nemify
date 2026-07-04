import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { CreateOwnerInvitationFormValues } from '../schema/invitation.schema';

export class CampusInvitationService {
  private async getRequestHeaders() {
    return await headers();
  }

  async createCampusInvitation(values: CreateInvitationBody) {
    return auth.api.createInvitation({
      body: values,
      headers: await this.getRequestHeaders(),
    });
  }

  async getCampusInvitation(id: string) {
    return await auth.api.getInvitation({
      query: {
        id,
      },
      headers: await this.getRequestHeaders(),
    });
  }

  async acceptCampusInvitation(invitationId: string) {
    return auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await this.getRequestHeaders(),
    });
  }
}

export type CreateInvitationBody = NonNullable<
  Parameters<typeof auth.api.createInvitation>[0]
>['body'];

export type CreateCampusInvitationResult = Awaited<
  ReturnType<CampusInvitationService['createCampusInvitation']>
>;

export type GetCampusInvitationResult = Awaited<
  ReturnType<CampusInvitationService['getCampusInvitation']>
>;

export type AcceptCampusInvitationResult = Awaited<
  ReturnType<CampusInvitationService['acceptCampusInvitation']>
>;
