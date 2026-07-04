import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createCampus,
  createCampusDepartment,
  createCampusRole,
  updateCampusRole,
} from '../api/campus.api';

export const useCreateCampus = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampus,

    // onSuccess() {
    //   queryClient.invalidateQueries({
    //     queryKey: ['campusRoles'],
    //   });
    // },
  });
};

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

export const useCreateCampusDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampusDepartment,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['campusDepartments'],
      });
    },
  });
};