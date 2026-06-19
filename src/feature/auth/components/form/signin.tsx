'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import {
  signInEmailPasswordSchema,
  SignInEmailPasswordValues,
} from '../../schema/auth.schema';
import { toast } from 'sonner';

export function SignInForm() {
  const { isLoading, signIn } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get('callbackURL');
  const message = searchParams.get('message');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInEmailPasswordValues>({
    resolver: zodResolver(signInEmailPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      callbackURL: callbackURL || '',
    },
  });

  // Show message if present in URL params
  React.useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  const onSubmit = async (data: SignInEmailPasswordValues) => {
    const result = await signIn(data);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    // Redirect to callback URL or default to /test
    const redirectTo = data.callbackURL || callbackURL || '/test';
    toast.success('Signed in successfully');
    router.push(redirectTo);
  };

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Hello</CardTitle>
          <CardDescription>
            Sign in to continue to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="new-email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
