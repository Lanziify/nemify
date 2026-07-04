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
  CreateCampusDepartmentFormValues,
  createCampusDepartmentSchema,
} from '../../schema/campus.schema';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateCampusDepartment } from '../../mutations/campus.mutation';
import { toast } from 'sonner';
import { ClientRequestError } from '@/lib/errors/client-error-parser';

interface DialogProps {
  // department: RowDepartment;
  campusId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampusDepartmentDialog({
  campusId,
  open,
  onOpenChange,
}: DialogProps) {
  const createDepartment = useCreateCampusDepartment();
  // const campusInvitation = useCreateCampusInvitation();

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCampusDepartmentFormValues>({
    resolver: zodResolver(createCampusDepartmentSchema),
    defaultValues: {
      name: '',
    },
  });

  // const selectedCampusId = watch('organizationId');

  // const { campuses, roles } = useCampusQueries({ campusId: selectedCampusId });

  // React.useEffect(() => {
  //   if (!open) {
  //     reset();
  //   }
  // }, [open, reset]);

  const onSubmit = async (values: CreateCampusDepartmentFormValues) => {
    try {
      await createDepartment.mutateAsync({
        campusId,
        ...values,
      });
    } catch (error) {
      console.log();

      if (error instanceof ClientRequestError) {
        onOpenChange(false);
        reset({ name: '' });
        toast.error(error.message);
      }
    }
  };

  React.useEffect(() => {
    if (open) {
      reset({ name: '' });
    }
  }, [open, reset]);

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
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Department Name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
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
