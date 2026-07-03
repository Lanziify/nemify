'use client';

import React from 'react';
import {
  AdminAccountSetupFormValues,
  adminAccountSetupSchema,
} from '../../schema/admin-account.schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

type AdminAccountSetupProps = {
  onNext: (d: AdminAccountSetupFormValues) => void;
  defaultValues?: AdminAccountSetupFormValues;
};

export default function AdminAccountStep({
  defaultValues,
  onNext,
}: AdminAccountSetupProps) {
  const initialValues = {
    email: '',
    name: '',
    password: '',
    callbackURL: `/setup/verification-success`,
  } satisfies AdminAccountSetupFormValues;

  const form = useForm<AdminAccountSetupFormValues>({
    resolver: zodResolver(adminAccountSetupSchema),
    defaultValues: {
      ...initialValues,
      ...defaultValues,
    },
  });

  React.useEffect(() => {
    form.reset(defaultValues || initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2 text-start">
        <h1 className="text-2xl font-bold">Setup your account</h1>
        <p>Fill out the form to create your admin account</p>
      </div>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                type="text"
                placeholder="John Doe"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="new-email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit">
          Next <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </form>
  );
}
