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
import { createCampusRoleSchema } from '../schema/campus.schema';
import { createCampus } from '../actions/campus.action';
import { useAuthStore } from '@/store/auth-store';
import type { z } from 'zod';
import { POLICIES } from '@/lib/auth/policies';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

type CreateCampusRoleFormValues = z.infer<typeof createCampusRoleSchema>;

interface CreateCampusRoleDialogProps {
  campusId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampusRoleDialog({
  campusId,
  open,
  onOpenChange,
}: CreateCampusRoleDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { updateAuthSession } = useAuthStore();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateCampusRoleFormValues>({
    resolver: zodResolver(createCampusRoleSchema),
    defaultValues: {
      organizationId: campusId,
      role: '',
      permission: {},
    },
  });

  const onSubmit = async (data: CreateCampusRoleFormValues) => {
    console.log(data);

    // setIsLoading(true);

    // const result = await createCampus(data);

    // if (result.error) {
    //   toast.error(result.error.message);
    //   setIsLoading(false);
    //   return;
    // }

    // toast.success('Role created successfully');

    // await updateAuthSession();

    // setIsLoading(false);
    // reset();
    // onOpenChange(false);
    // router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
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

            {Object.entries(POLICIES).map(([resourceKey, policy]) => {
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
                disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                form="campus-role-form">
                {isLoading ? 'Creating...' : 'Create Role'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
