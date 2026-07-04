'use client';

import {
  CreateCampusFormValues,
  createCampusSchema,
} from '@/feature/campus/schema/campus.schema';
import { slugify } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type CreateCampusStepProps = {
  showPrev: boolean;
  onPrev: () => void;
  onNext: (d: CreateCampusFormValues) => void;
  defaultValues?: CreateCampusFormValues;
};

export default function CreateCampusStep({
  showPrev,
  defaultValues,
  onNext,
  onPrev,
}: CreateCampusStepProps) {
  const initialValues = {
    name: '',
    slug: '',
  } satisfies CreateCampusFormValues;

  const form = useForm<CreateCampusFormValues>({
    resolver: zodResolver(createCampusSchema),
    defaultValues: defaultValues || initialValues,
  });

  const nameValue = form.watch('name');

  React.useEffect(() => {
    form.reset(defaultValues || initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  React.useEffect(() => {
    form.setValue('slug', slugify(nameValue), { shouldValidate: false });
  }, [nameValue, form.setValue]);

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2 text-start">
        <h1 className="text-2xl font-bold">Create campus</h1>
        <p>Fill out the form to create your campus</p>
      </div>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Campus Name</FieldLabel>
              <Input
                {...field}
                id="name"
                type="text"
                placeholder="Main Campus"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                {...field}
                id="slug"
                type="text"
                placeholder="main-campus"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-between">
        {showPrev !== false && (
          <Button type="button" variant="secondary" onClick={onPrev}>
            <ArrowLeftIcon className="size-4" /> Previous
          </Button>
        )}
        <Button type="submit">
          Submit <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </form>
  );
}
