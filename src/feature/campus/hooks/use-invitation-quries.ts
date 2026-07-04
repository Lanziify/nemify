import { useQuery } from '@tanstack/react-query';
import { campusInvitationQueries } from '../queries/invitation.query';

type CampusInvitationQueriesHookProps = {
  invitationId: string;
  enabled: boolean;
};

export const useCampusInvitationQueries = ({
  invitationId,
  enabled
}: CampusInvitationQueriesHookProps) => {
  const campusInvitation = useQuery(
    campusInvitationQueries.getInvitationById(invitationId, enabled)
  );

  return {
    campusInvitation
  }
};
