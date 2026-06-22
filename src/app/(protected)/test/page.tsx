'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function TestPage() {
  const { session, user, campus, signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Test Page</CardTitle>
          <CardDescription>
            Protected route - Only authenticated and verified users can access
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {user && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 font-semibold">User Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Email Verified:</span>{' '}
                  {user.emailVerified ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">Platform Role:</span> {' '}
                  {user.platformRole}
                </p>
              </div>
            </div>
          )}

          {session && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 font-semibold">Session Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Session ID:</span> {session.id}
                </p>
                <p>
                  <span className="font-medium">Expires:</span>{' '}
                  {new Date(session.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {campus && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 font-semibold">Campus Information</h3>
              <div className="space-y-1 text-sm">
                <div className="space-y-1">
                  <p>
                    <span>Campus ID: {campus.id}</span>
                  </p>
                  <p>
                    <span>Campus Name: {campus.name}</span>
                  </p>
                  <p>
                    <span>Slug: {campus.slug}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
