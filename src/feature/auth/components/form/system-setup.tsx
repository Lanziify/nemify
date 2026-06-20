'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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
import { signUpEmailSchema, SignUpEmailValues } from '../../schema/auth.schema';
import { toast } from 'sonner';
import { safeCatch } from '@/lib/errors/safe-catch';
import { createSystemAccount } from '../../services/auth.service';
import { json } from 'better-auth';
import { BaseError } from '@/types/api-response';

export function UserCreationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpEmailValues>({
    resolver: zodResolver(signUpEmailSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignUpEmailValues) => {
    setIsLoading(true);

    const result = await safeCatch(async () => {
      const response = await fetch('/api/system/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = (await response.json()) as BaseError;
        throw new Error(error.message);
      }

      return (await response.json()) as ReturnType<typeof createSystemAccount>;
    });

    setIsLoading(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    router.push('/test');
  };

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Create User</CardTitle>
          <CardDescription>
            Set up a new user account for your system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

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
              {isLoading ? 'Creating user...' : 'Create User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
