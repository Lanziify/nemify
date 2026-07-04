import axios from 'axios';
import {
  AcceptCampusInvitationResult,
  CreateCampusInvitationResult,
  GetCampusInvitationResult,
} from '../services/invitation.service';
import { CreateCampusInvitationFormValues } from '../schema/invitation.schema';
import { withClientErrorHandling } from '@/lib/errors/client-error-parser';

export const createCampusInvitation = withClientErrorHandling(
  async (values: CreateCampusInvitationFormValues) => {
    const { data } = await axios.post<CreateCampusInvitationResult>(
      `/api/campus/${values.organizationId}/invitations`,
      values
    );

    return data;
  }
);

export const getCampusInvitation = withClientErrorHandling(
  async (id: string) => {
    const { data } = await axios.get<GetCampusInvitationResult>(
      `/api/invitations/${id}`
    );

    return data;
  }
);

export const acceptCampusInvitation = withClientErrorHandling(
  async (id: string) => {
    const { data } = await axios.post<AcceptCampusInvitationResult>(
      `/api/invitations/${id}/accept`
    );

    return data;
  }
);
