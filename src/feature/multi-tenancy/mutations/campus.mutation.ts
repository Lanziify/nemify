// campus.mutation.ts

import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { inviteUserToCampus } from '../api/campus.api';

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteUserToCampus,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['campuses'],
      });
    },
  });
};

export const campusMutations = {
  invite: () =>
    mutationOptions({
      mutationFn: inviteUserToCampus,
    }),
};
