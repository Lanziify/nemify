import { useQuery } from '@tanstack/react-query';
import { campusInvitationQueries } from '../queries/invitation.query';

type CampusInvitationQueriesHookProps = {
  invitationId?: string;
};

export const useCampusInvitationQueries = ({
  invitationId,
}: CampusInvitationQueriesHookProps) => {
  const campusInvitation = useQuery(
    campusInvitationQueries.getInvitationById(invitationId!)
  );

  return {
    campusInvitation
  }
};
