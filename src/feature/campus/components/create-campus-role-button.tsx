'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { CreateCampusRoleDialog } from './create-campus-role-dialog';
import { cn } from '@/lib/utils';

export function CreateCampusRoleButton({
  campusId,
  ...props
}: React.ComponentProps<'button'> & { campusId: string }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { user } = useAuthStore();

  // Only show for system_admin users
  // if (user?.platformRole !== 'system_admin') {
  //   return null;
  // }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} size="sm" {...props}>
        Create Role
      </Button>
      <CreateCampusRoleDialog
        campusId={campusId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
