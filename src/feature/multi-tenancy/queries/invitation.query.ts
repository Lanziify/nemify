import { queryOptions } from '@tanstack/react-query';
import { getCampusInvitation } from '../api/invitations.api';

export const campusInvitationQueries = {
  getInvitationById: (id: string) =>
    queryOptions({
      queryKey: ['campusInvitation', id],
      queryFn: () => getCampusInvitation(id),
      enabled: !!id,
    }),
};
