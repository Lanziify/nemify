'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { CreateCampusDialog } from './create-campus-dialog';
import { cn } from '@/lib/utils';

export function CreateCampusButton(props: React.ComponentProps<'button'>) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { user } = useAuthStore();

  // Only show for system_admin users
  // if (user?.platformRole !== 'system_admin') {
  //   return null;
  // }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} size="sm" {...props}>
        Create Campus
      </Button>
      <CreateCampusDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
