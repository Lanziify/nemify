import { Providers } from '@/components/provider/auth-provider';
import React from 'react';
import { redirect } from 'next/navigation';
import { authClient } from '@/utils/auth-client';
import { toast } from 'sonner';

type ProtectedPagesLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedPagesLayout({
  children,
}: ProtectedPagesLayoutProps) {
  const { data, error } = await authClient.getSession();

  if (error || !data) {
    // toast.error(error ? error.message : "Something wen't wrong");
    redirect('/signin');
  }

  return <Providers sessionData={data}>{children}</Providers>;
}
