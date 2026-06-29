import { useMutation, useQueryClient } from '@tanstack/react-query';

import { campusMutations } from '../mutations/campus.mutation';

export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    ...campusMutations.invite(),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['campuses'],
      });
    },
  });
}
