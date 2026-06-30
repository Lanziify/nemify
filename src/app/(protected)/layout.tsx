import { AuthProvider } from '@/components/provider/auth-provider';
import React from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { getSessionData } from '@/feature/auth/actions/auth.action';

type ProtectedPagesLayoutProps = {
  breadcrumbs: React.ReactNode;
  children: React.ReactNode;
};

export default async function ProtectedPagesLayout({
  breadcrumbs,
  children,
}: ProtectedPagesLayoutProps) {
  const { data, error } = await getSessionData();

  if (!data || error) {
    // toast.error(error?.message ?? "Something wen't wrong");
    redirect('/signin');
  }

  return (
    <AuthProvider sessionData={data}>
      <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center p-4">
        {breadcrumbs}
        {children}
      </div>
    </AuthProvider>
  );
}
