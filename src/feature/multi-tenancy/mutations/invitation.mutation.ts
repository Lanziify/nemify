import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptCampusInvitation, createCampusInvitation } from '../api/invitations.api';

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

export const useAcceptCampusInvitation = () => {
    // const queryClient = useQueryClient();

    return useMutation({
      mutationFn: acceptCampusInvitation,

      // onSuccess() {
      //   queryClient.invalidateQueries({
      //     queryKey: ['campuses'],
      //   });
      // },
    });
};
