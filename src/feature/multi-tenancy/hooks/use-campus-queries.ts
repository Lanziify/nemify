import { useQuery, useQueries } from '@tanstack/react-query';

import { campusQueries } from '../queries/campus.query';

type CampusQueriesHookProps = { campusId?: string; campusSlug?: string };

export const useCampusQueries = ({
  campusId,
  campusSlug,
}: CampusQueriesHookProps) => {
  const [campus, campuses] = useQueries({
    queries: [campusQueries.campus(), campusQueries.campuses()],
  });

  const campusBySlug = useQuery(campusQueries.campusBySlug(campusSlug));

  const roles = useQuery(
    campusQueries.roles(campusId ?? campusBySlug.data?.id ?? campus.data?.id)
  );

  return {
    campus,
    campusBySlug,
    campuses,
    roles,
  };
};
