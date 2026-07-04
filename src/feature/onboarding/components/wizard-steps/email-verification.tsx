'use client';

import { WizardFormData } from '@/app/setup/setup-wizard';
import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import {
  signInUserAccount,
  signUpAdminAccount,
  updatePlatformState,
} from '@/feature/auth/actions/auth.action';
import { useCreateCampus } from '@/feature/campus/mutations/campus.mutation';
import { authClient } from '@/utils/auth-client';
import { CheckCircle2, MailIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const PENDING_CAMPUS_KEY = 'nemify:pending-campus';

type VerificationStatus =
  | 'creating'
  | 'verifying'
  | 'creating-campus'
  | 'completed'
  | 'error';

type EmailVerificationStepProps = {
  formValues?: WizardFormData;
};

export default function EmailVerificationStep({
  formValues,
}: EmailVerificationStepProps) {
  const router = useRouter();
  const createCampus = useCreateCampus();

  const adminUserIdRef = React.useRef<string | null>(null);

  const [status, setStatus] = React.useState<VerificationStatus>('creating');
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const isSessionInit = React.useRef<boolean>(false);

  const createCampusCallback = React.useCallback(async () => {
    const campusData =
      formValues?.campus ??
      JSON.parse(sessionStorage.getItem(PENDING_CAMPUS_KEY) ?? 'null');

    if (!campusData) {
      setStatus('error');
      setErrorMessage('Campus data not found. Please start over.');
      return null;
    }

    if (!adminUserIdRef.current) {
      setStatus('error');
      setErrorMessage('Admin user not found.');
      return null;
    }

    try {
      const result = await createCampus.mutateAsync(campusData);
      return result;
    } catch (error) {
      setStatus('error');

      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create campus.'
      );

      return null;
    }
  }, [formValues?.campus, createCampus]);

  const finalizeSetup = React.useCallback(async () => {
    setStatus('creating-campus');

    const admin = await createCampusCallback();

    if (!admin) {
      setStatus('error');
      return;
    }

    await updatePlatformState(String(admin.id));

    sessionStorage.removeItem(PENDING_CAMPUS_KEY);

    setStatus('completed');
  }, [createCampusCallback]);

  React.useEffect(() => {
    if (formValues?.campus) {
      sessionStorage.setItem(
        PENDING_CAMPUS_KEY,
        JSON.stringify(formValues.campus)
      );
    }
  }, [formValues?.campus]);

  /**
   * Step 1: Create admin account
   */
  React.useEffect(() => {
    const isMounted = { current: true };

    const createAdmin = async () => {
      if (!formValues?.account) {
        setErrorMessage('Missing account information.');
        setStatus('error');
        return;
      }

      if (!isMounted.current) return;

      const { data: adminData, error: signUpError } = await signUpAdminAccount(
        formValues.account
      );

      if (signUpError) {
        setErrorMessage(signUpError.message ?? 'Failed to create account.');
        setStatus('error');
        return;
      }
      11;
      adminUserIdRef.current = adminData?.user?.id ?? null;

      await signInUserAccount({
        email: formValues.account.email!,
        password: formValues.account.password,
      });

      await authClient.getSession();

      isSessionInit.current = true;

      // Wait for email verification
      setStatus('verifying');
    };

    createAdmin();

    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Step 2: Poll session after email verification
   */
  React.useEffect(() => {
    if (status !== 'verifying') return;

    const channel = new BroadcastChannel('platform-setup');

    channel.onmessage = (event) => {
      if (event.data === 'email-verified') {
        finalizeSetup();
      }
    };

    return () => {
      channel.close();
    };
  }, [status, finalizeSetup]);

  React.useEffect(() => {
    if (status !== 'completed') return;

    const isMounted = { current: true };
    let timer: ReturnType<typeof setTimeout>;

    if (!isMounted.current) return;

    timer = setTimeout(() => router.push('/test'), 3000);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [status]);

  /**
   * UI states
   */
  if (status === 'creating') {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Spinner className="size-8" />
        <p className="text-muted-foreground text-sm">Creating your account…</p>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <Empty className="border-none p-4">
        <EmptyHeader>
          <MailIcon className="text-muted-foreground size-10" />
          <h2 className="text-2xl font-bold">Check Your Email</h2>

          <EmptyDescription>
            A verification link was sent to{' '}
            <span className="text-foreground font-medium">
              {formValues?.account?.email}
            </span>
            .
          </EmptyDescription>

          <p className="text-muted-foreground mt-2 text-xs">
            Keep this tab open — setup will continue automatically after
            verification.
          </p>
        </EmptyHeader>
      </Empty>
    );
  }

  if (status === 'creating-campus') {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Spinner className="size-8" />
        <p className="text-muted-foreground text-sm">Creating your campus…</p>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <Empty className="border-none p-4">
        <EmptyHeader>
          <CheckCircle2 className="size-8" />
          <h2 className="text-2xl font-bold">Setup Completed!</h2>

          <EmptyDescription>
            You will be redirected in a moment.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (status === 'error') {
    return (
      <Empty className="border-none p-4">
        <EmptyHeader>
          <h2 className="text-destructive text-2xl font-bold">
            Something went wrong
          </h2>

          <EmptyDescription>
            {errorMessage ??
              'An unexpected error occurred. Please refresh and try again.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return null;
}
