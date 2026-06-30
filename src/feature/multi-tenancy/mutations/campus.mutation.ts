import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCampusRole, updateCampusRole } from '../api/campus.api';

export const useCreateCampusRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampusRole,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['campusRoles'],
      });
    },
  });
};

export const useUpdateCampusRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCampusRole,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['campusRoles'],
      });
    },
  });
};
