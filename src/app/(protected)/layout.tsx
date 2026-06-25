import { AuthProvider } from '@/components/provider/auth-provider';
import React from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { getSessionData } from '@/feature/auth/actions/auth.action';
import { DynamicTableWrapper } from '@/components/custom/dynamic-data-table/table';

type ProtectedPagesLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedPagesLayout({
  children,
}: ProtectedPagesLayoutProps) {
  const { data, error } = await getSessionData();

  if (!data || error) {
    // toast.error(error?.message ?? "Something wen't wrong");
    redirect('/signin');
  }

  return <AuthProvider sessionData={data}>{children}</AuthProvider>;
}
