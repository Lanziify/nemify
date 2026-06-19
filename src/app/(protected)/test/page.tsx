import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TestPageClient } from './test-page-client';

export default async function TestPage() {
  // Fetch session on the server (uses the 5-min cache)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Double-check authentication (middleware should handle this, but just in case)
  if (!session?.user || !session?.session) {
    redirect('/signin');
  }

  // Render with server-fetched data - no loading state needed!
  return <TestPageClient user={session.user} session={session.session} />;
}
