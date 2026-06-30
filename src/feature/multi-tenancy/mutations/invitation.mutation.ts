import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCampusInvitation } from '../api/invitations.api';

export const useCreateCampusInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampusInvitation,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['campuses'],
      });
    },
  });
};
