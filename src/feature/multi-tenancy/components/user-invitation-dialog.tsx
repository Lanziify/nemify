'use client';

import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import {
  CreateUserInvitationFormValues,
  createUserInvitationSchema,
} from '../schema/campus.schema';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { RowUser } from '@/feature/users/data/user-columns';
import { useCampusQueries } from '../hooks/use-campus-queries';

import { Field } from '@/components/ui/field';
import { useInviteUser } from '../hooks/use-campus-mutations';

interface DialogProps {
  user: RowUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampusInviationDialog({
  user,
  open,
  onOpenChange,
}: DialogProps) {
  const invite = useInviteUser();

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUserInvitationFormValues>({
    resolver: zodResolver(createUserInvitationSchema),
    defaultValues: {
      email: user?.email ?? '',
      organizationId: '',
      role: '',
      resend: true,
    },
  });

  const selectedCampusId = watch('organizationId');

  const { campuses, roles } = useCampusQueries({ campusId: selectedCampusId });

  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (values: CreateUserInvitationFormValues) => {
    await invite.mutateAsync(values);
  };

  React.useEffect(() => {
    if (open) {
      reset({
        email: user.email,
        organizationId: '',
        role: '',
        resend: true,
      });
    }
  }, [open, user, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>

          <DialogDescription>
            Invite user to campus organization. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="organizationId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>

                <SelectContent>
                  {campuses.data?.map((campus) => (
                    <SelectItem key={campus.id} value={campus.id}>
                      {campus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  {roles.data?.map((role) => (
                    <SelectItem key={role.id} value={role.role}>
                      {role.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
