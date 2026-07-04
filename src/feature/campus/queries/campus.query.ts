import { queryOptions } from '@tanstack/react-query';
import {
  getCampus,
  getCampusBySlug,
  getCampusDepartments,
  getCampuses,
  GetCampusMemberParams,
  getCampusMembers,
  getCampusRoles,
} from '../api/campus.api';

export const campusQueries = {
  all: ['campuses'],

  campus: () =>
    queryOptions({
      queryKey: ['campus'],
      queryFn: () => getCampus(),
    }),

  campusBySlug: (slug?: string) =>
    queryOptions({
      queryKey: ['campus', slug],
      queryFn: () => getCampusBySlug(slug!),
      enabled: !!slug,
    }),

  campuses: () =>
    queryOptions({
      queryKey: [...campusQueries.all],
      queryFn: () => getCampuses(),
    }),

  roles: (campusId?: string) =>
    queryOptions({
      queryKey: ['campusRoles', campusId],
      queryFn: () => getCampusRoles(campusId!),
      enabled: !!campusId,
    }),

  members: ({ campusId, query }: GetCampusMemberParams) =>
    queryOptions({
      queryKey: ['campusMembers', query],
      queryFn: () => getCampusMembers({ campusId, query }),
      enabled: !!campusId,
    }),

  departments: (campusId?: string) =>
    queryOptions({
      queryKey: ['campusDepartments', campusId],
      queryFn: () => getCampusDepartments(campusId!),
      enabled: !!campusId,
    }),
};
