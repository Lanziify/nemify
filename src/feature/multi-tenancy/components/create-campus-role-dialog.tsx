'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BaseCampusRoleFormValues,
  baseCampusRoleSchema,
} from '../schema/campus.schema';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/utils/query-client';
import axios from 'axios';
import { CreateCampusRoleServiceResult } from '../services/campus.service';
import { CampusSchemaAdapter } from '../utils/schema-adapter';
import { CampusRoleRow } from '../data/role-columns';
import { CAMPUS_POLICIES } from '@/lib/auth/policies.campus';

interface CreateCampusRoleDialogProps {
  campusId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editValues?: CampusRoleRow;
}

type DialogMode = 'Default' | 'Editing' | 'Loading';

export function CreateCampusRoleDialog({
  campusId,
  open,
  onOpenChange,
  editValues,
}: CreateCampusRoleDialogProps) {
  const router = useRouter();

  const defaultFormValues: BaseCampusRoleFormValues = {
    role: '',
    permission: {},
  };

  const createNewCampusRoleMutation = useMutation({
    mutationKey: ['createCampusRole'],
    mutationFn: async (data: BaseCampusRoleFormValues) => {
      const transformer = new CampusSchemaAdapter(data);
      const isEditing = !!editValues;

      if (isEditing) {
        return (
          await axios.patch<CreateCampusRoleServiceResult>(
            `/api/campus/${campusId}/roles`,
            transformer.transformBaseValuesToUpdate(editValues)
          )
        ).data;
      }

      return (
        await axios.post<CreateCampusRoleServiceResult>(
          `/api/campus/${campusId}/roles`,
          transformer.transformBaseValuesToCreate({
            organizationId: campusId,
          })
        )
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campusRole'],
      });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BaseCampusRoleFormValues>({
    resolver: zodResolver(baseCampusRoleSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit = async (data: BaseCampusRoleFormValues) => {
    await createNewCampusRoleMutation.mutateAsync(data);

    toast.success('Role created successfully');

    reset();
    onOpenChange(false);
    router.refresh();
  };

  const dialogMode: DialogMode = createNewCampusRoleMutation.isPending
    ? 'Loading'
    : editValues
      ? 'Editing'
      : 'Default';

  React.useEffect(() => {
    reset({
      ...defaultFormValues,
      ...editValues,
      permission: {
        ...defaultFormValues.permission,
        ...editValues?.permission,
      },
    });
  }, [editValues, campusId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {dialogMode === 'Editing' ? 'Edit Role' : 'Create New Role'}
          </DialogTitle>
          <DialogDescription>
            Create a new campus role. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form id="campus-role-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="no-scrollbar max-h-[50vh] space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Role</Label>
              <Input
                id="name"
                type="text"
                placeholder="Staff"
                {...register('role')}
              />
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {Object.entries(CAMPUS_POLICIES).map(([resourceKey, policy]) => {
              return (
                <div className="not-first-of-type:mb-8" key={resourceKey}>
                  <h2 className="font-bold">{policy.label}</h2>
                  <p className="text-muted-foreground mb-4">
                    {policy.description}
                  </p>

                  <div className="space-y-4">
                    {Object.entries(policy.actions).map(
                      ([actionKey, action]) => {
                        return (
                          <Field
                            orientation="horizontal"
                            className="max-w-sm"
                            key={actionKey}>
                            <FieldContent>
                              <FieldLabel
                                htmlFor={String(action.label)
                                  .replaceAll(' ', '-')
                                  .toLocaleLowerCase()}>
                                {action.label}
                              </FieldLabel>
                              <FieldDescription>
                                {action.description}
                              </FieldDescription>
                            </FieldContent>
                            <Switch
                              id={String(action.label)
                                .replaceAll(' ', '-')
                                .toLocaleLowerCase()}
                              checked={
                                watch('permission')?.[resourceKey]?.includes(
                                  actionKey
                                ) ?? false
                              }
                              onCheckedChange={(checked) => {
                                const current = watch('permission');

                                const currentActions =
                                  current?.[resourceKey] ?? [];

                                let nextActions: string[];

                                if (checked) {
                                  nextActions = [
                                    ...new Set([...currentActions, actionKey]),
                                  ];
                                } else {
                                  nextActions = currentActions.filter(
                                    (a) => a !== actionKey
                                  );
                                }

                                const nextPermission = {
                                  ...current,
                                };

                                if (nextActions.length === 0) {
                                  delete nextPermission[resourceKey];
                                } else {
                                  nextPermission[resourceKey] = nextActions;
                                }

                                setValue('permission', nextPermission);
                              }}
                              disabled={dialogMode === 'Loading'}
                            />
                          </Field>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createNewCampusRoleMutation.isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createNewCampusRoleMutation.isPending}>
                {createNewCampusRoleMutation.isPending
                  ? editValues
                    ? 'Saving...'
                    : 'Creating...'
                  : editValues
                    ? 'Save Changes'
                    : 'Create Role'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
