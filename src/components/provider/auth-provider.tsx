'use client';

import { useAuthStore } from '@/store/auth-store';
import { AuthType } from '@/utils/auth';
import React from 'react';

type AuthProvidersProps = {
  sessionData: AuthType['Session'];
  children: React.ReactNode;
};

export function AuthProvider({ sessionData, children }: AuthProvidersProps) {
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  React.useEffect(() => {
    if (!sessionData) return;

    setAuthSession(sessionData);
  }, [sessionData]);

  return <>{children}</>;
}
