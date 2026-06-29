import { queryOptions } from '@tanstack/react-query';
import {
  getCampus,
  getCampusBySlug,
  getCampuses,
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
};
