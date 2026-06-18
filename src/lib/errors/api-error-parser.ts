import z, { ZodError } from 'zod';
import { NextResponse } from 'next/server';
import {NoResultError} from 'kysely'

import { APIError } from 'better-auth/api';

export function apiErrorParser(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: z.flattenError(error),
      },
      {
        status: 400,
      }
    );
  }

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        code: error.body?.code,
        message: error.body?.message,
        details: error.cause,
      },
      {
        status: error.statusCode,
      }
    );
  }

  if (error instanceof NoResultError) {
    console.log(error.name);
  }

  return NextResponse.json(
    {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
    {
      status: 500,
    }
  );
}
