'use client';

import { useAuthStore } from '@/store/auth-store';
import { AuthType } from '@/utils/auth';
import React from 'react';

type ProvidersProps = {
  sessionData: AuthType['Session'];
  children: React.ReactNode;
};

export function Providers({ sessionData, children }: ProvidersProps) {
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  React.useEffect(() => {
    if (!sessionData) return;

    setAuthSession(sessionData);
  }, [sessionData]);

  return <>{children}</>;
}
