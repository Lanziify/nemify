'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';

import { Spinner } from '@/components/ui/spinner';

import { authClient } from '@/utils/auth-client';
import { AuthType } from '@/utils/auth';

import { useCampusInvitationQueries } from '../hooks/use-invitation-quries';
import { useAcceptCampusInvitation } from '../mutations/invitation.mutation';

type Status = 'verifying' | 'accepting' | 'success' | 'error';

export function CampusInvitationAcceptance() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const invitationId = searchParams.get('id');

  const [session, setSession] = React.useState<
    AuthType['Session']['session'] | null
  >(null);

  const [isLoading, setIsLoading] = React.useState(true);

  const [status, setStatus] = React.useState<Status>('verifying');

  const hasTriggered = React.useRef(false);

  const acceptInvitation = useAcceptCampusInvitation();

  /**
   * Load auth session
   */
  React.useEffect(() => {
    async function loadSession() {
      try {
        const { data } = await authClient.getSession();

        setSession(data?.session ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  /**
   * Fetch invitation only after auth resolves
   */
  const { campusInvitation } = useCampusInvitationQueries({
    invitationId: invitationId ?? '',

    enabled: !isLoading && !!session && !!invitationId,
  });

  /**
   * Redirect after session loads
   */
  React.useEffect(() => {
    if (isLoading) return;

    if (!invitationId) {
      router.replace('/test?error=missing_invitation');

      return;
    }

    if (!session) {
      router.replace(
        `/signin?callbackURL=${encodeURIComponent(
          `/invite/campus-invitation?id=${invitationId}`
        )}`
      );

      return;
    }
  }, [isLoading, session, invitationId, router]);

  /**
   * Invitation validation failed
   */
  React.useEffect(() => {
    if (!campusInvitation.error) return;

    setStatus('error');

    setTimeout(() => {
      router.replace('/test?error=invalid_invitation');
    }, 1500);
  }, [campusInvitation.error, router]);

  /**
   * Accept invitation once
   */
  React.useEffect(() => {
    if (
      isLoading ||
      !session ||
      !invitationId ||
      hasTriggered.current ||
      !campusInvitation.data
    ) {
      return;
    }

    hasTriggered.current = true;

    setStatus('accepting');

    acceptInvitation.mutate(invitationId, {
      onSuccess: () => {
        setStatus('success');

        setTimeout(() => {
          router.replace('/test');
        }, 1800);
      },

      onError: () => {
        setStatus('error');

        setTimeout(() => {
          router.replace('/test?error=accept_failed');
        }, 1500);
      },
    });
  }, [
    isLoading,
    session,
    invitationId,
    campusInvitation.data,
    acceptInvitation,
    router,
  ]);

  if (isLoading || campusInvitation.isLoading) {
    return (
      <Empty>
        <Spinner />
      </Empty>
    );
  }

  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {status === 'success' ? (
            <CheckCircle2 className="size-10 text-green-500" />
          ) : (
            <Spinner />
          )}
        </EmptyMedia>

        <EmptyTitle>
          {status === 'verifying' && 'Verifying invitation'}

          {status === 'accepting' && 'Accepting invitation'}

          {status === 'success' && 'Invitation accepted'}

          {status === 'error' && 'Something went wrong'}
        </EmptyTitle>

        <EmptyDescription>
          {status === 'success'
            ? 'Redirecting you to your campus…'
            : 'Please wait while we process your request.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
