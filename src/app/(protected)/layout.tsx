import { Providers } from '@/components/provider/auth-provider';
import { getAuthSession } from '@/feature/auth/actions/auth.action';
import React from 'react';
import { redirect } from 'next/navigation';

type ProtectedPagesLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedPagesLayout({
  children,
}: ProtectedPagesLayoutProps) {
  const data = await getAuthSession();

  if (!data?.session) {
    redirect('/signin');
  }

  return <Providers sessionData={data}>{children}</Providers>;
}
