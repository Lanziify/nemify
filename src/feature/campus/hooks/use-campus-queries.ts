import { useQuery, useQueries } from '@tanstack/react-query';

import { campusQueries } from '../queries/campus.query';
import { GetCampusMembersQueryFormValues } from '../schema/campus.schema';

type CampusQueriesHookProps = {
  campusId?: string;
  campusSlug?: string;
  query?: Record<string, unknown>;
};

export const useCampusQueries = ({
  campusId,
  campusSlug,
  query,
}: CampusQueriesHookProps) => {
  const [campus, campuses] = useQueries({
    queries: [campusQueries.campus(), campusQueries.campuses()],
  });

  const campusBySlug = useQuery(campusQueries.campusBySlug(campusSlug));

  const members = useQuery(
    campusQueries.members({
      campusId: campus.data?.id ?? campusId!,
      query: query as GetCampusMembersQueryFormValues,
    })
  );

  const roles = useQuery(
    campusQueries.roles(campusId ?? campusBySlug.data?.id ?? campus.data?.id)
  );

  return {
    campus,
    campusBySlug,
    campuses,
    roles,
    members,
  };
};
