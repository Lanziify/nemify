'use client';

import * as React from 'react';

import { useAuthStore } from '@/store/auth-store';
import { AuthType } from '@/utils/auth';

type AuthProvidersProps = {
  sessionData: AuthType['Session'] | null;
  children: React.ReactNode;
};

export function AuthProvider({ sessionData, children }: AuthProvidersProps) {
  const initialized = React.useRef(false);

  if (!initialized.current) {
    initialized.current = true;

    useAuthStore.setState({
      user: sessionData?.user ?? null,

      session: sessionData?.session ?? null,

      isInitialized: true,
    });
  }

  return children;
}
