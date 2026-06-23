'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { CreateCampusDialog } from './create-campus-dialog';

export function CreateCampusButton() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { user } = useAuthStore();

  // Only show for system_admin users
  if (user?.platformRole !== 'system_admin') {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} size="sm">
        Create Campus
      </Button>
      <CreateCampusDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
