import axios from 'axios';
import {
  CampusRoleServiceResult,
  CreateUserInvitationServiceResult,
  GetAllCampusServiceResponse,
  GetCampusServiceResponse,
} from '../services/campus.service';
import { CreateUserInvitationFormValues } from '../schema/campus.schema';

export async function getCampus() {
  const { data } = await axios.get<GetCampusServiceResponse>('/api/campus');

  return data;
}

export async function getCampusBySlug(slug: string) {
  const { data } = await axios.get<GetCampusServiceResponse>(
    `/api/campus/by-slug/${slug}`
  );

  return data;
}

export async function getCampuses() {
  const { data } = await axios.get<GetAllCampusServiceResponse>('/api/campus');

  return data;
}

export async function getCampusRoles(id: string) {
  const { data } = await axios.get<CampusRoleServiceResult>(
    `/api/campus/${id}/roles`
  );
  return data;
}

// MUTATIONS
export async function inviteUserToCampus(
  values: CreateUserInvitationFormValues
) {
  const { data } = await axios.post<CreateUserInvitationServiceResult>(
    `/api/campus/${values.organizationId}/invitations`,
    values
  );
  return data;
}
