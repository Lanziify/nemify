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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOrganizationSchema } from '../schema/campus.schema';
import { createCampus } from '../actions/campus.action';
import { useAuthStore } from '@/store/auth-store';
import type { z } from 'zod';

type CreateCampusFormValues = z.infer<typeof createOrganizationSchema>;

interface CreateCampusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampusDialog({
  open,
  onOpenChange,
}: CreateCampusDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { updateAuthSession } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCampusFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      slug: '',
      keepCurrentActiveOrganization: true,
    },
  });

  const onSubmit = async (data: CreateCampusFormValues) => {
    setIsLoading(true);

    const result = await createCampus(data);

    if (result.error) {
      toast.error(result.error.message);
      setIsLoading(false);
      return;
    }

    toast.success('Campus created successfully');

    await updateAuthSession();

    setIsLoading(false);
    reset();
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create New Campus</DialogTitle>
          <DialogDescription>
            Create a new campus organization. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campus Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Campus Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Central University"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Campus Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Campus Slug</Label>
            <Input
              id="slug"
              type="text"
              placeholder="e.g., central-university"
              {...register('slug')}
            />
            <p className="text-muted-foreground text-xs">
              A unique identifier for the campus (URL-friendly)
            </p>
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Campus'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
