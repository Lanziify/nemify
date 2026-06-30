'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuthStore } from '@/store/auth-store';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { useCampusInvitationQueries } from '../hooks/use-invitation-quries';
import { AxiosError } from 'axios';

export function CampusInvitationAcceptance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get('id');
  const { session } = useAuthStore();

  if (!invitationId) {
    router.push('/signin?error=missing_invitation');
  }

  if (!session) {
    const callbackURL = `/invite/campus-invitation?id=${invitationId}`;
    router.push(
      `/signin?callbackURL=${encodeURIComponent(callbackURL)}&message=${encodeURIComponent('Please sign in to accept the campus invitation')}`
    );
  }

  const { campusInvitation } = useCampusInvitationQueries({
    invitationId: invitationId!,
  });

  if (campusInvitation.error) {
    const error = campusInvitation.error as AxiosError<{
      message: string;
    }>;

    router.push(`/test?message=${error.message}`);
  }

  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Please wait</EmptyTitle>
        <EmptyDescription>
          Please wait while we process your request. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      {/* <EmptyContent>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </EmptyContent> */}
    </Empty>
  );
}
