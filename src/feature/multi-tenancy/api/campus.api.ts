import axios from 'axios';
import {
  CampusRoleServiceResult,
  CreateCampusRoleServiceResult,
  GetAllCampusServiceResponse,
  GetCampusMembersServiceResult,
  GetCampusServiceResponse,
  UpdateCampusRoleServiceResult,
} from '../services/campus.service';
import { GetCampusMembersQueryFormValues } from '../schema/campus.schema';
import { CampusSchemaAdapter } from '../utils/schema-adapter';

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

export type GetCampusMemberParams = {
  campusId: string;
  query: GetCampusMembersQueryFormValues;
};

export async function getCampusMembers({
  campusId,
  query,
}: GetCampusMemberParams) {
  const { data } = await axios.get<GetCampusMembersServiceResult>(
    `/api/campus/${campusId}/members`,
    { params: query }
  );

  return data;
}

// MUTATIONS
type CreateCampusRoleParams = {
  campusId: string;
  values: ReturnType<CampusSchemaAdapter['transformBaseValuesToCreate']>;
};

export async function createCampusRole({
  campusId,
  values,
}: CreateCampusRoleParams) {
  const { data } = await axios.post<CreateCampusRoleServiceResult>(
    `/api/campus/${campusId}/roles`,
    values
  );

  return data;
}

type UpdateCampusRoleParams = {
  campusId: string;
  values: ReturnType<CampusSchemaAdapter['transformBaseValuesToUpdate']>;
};

export async function updateCampusRole({
  campusId,
  values,
}: UpdateCampusRoleParams) {
  const { data } = await axios.patch<UpdateCampusRoleServiceResult>(
    `/api/campus/${campusId}/roles`,
    values
  );

  return data;
}
