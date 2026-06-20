'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
// import { useCampusStore } from '@/store/tenancy-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const initSession = useAuthStore((state) => state.initSession);
  // const { initCampus } = useCampusStore();
  
  useEffect(() => {
    initSession();
    // initCampus();
  }, [initSession]);

  return <>{children}</>;
}
