import type { z } from 'zod';
import {  ServerErrorCode } from './error-codes';

export type ValidationApiError = {
  code: 'VALIDATION_ERROR';
  message: string;
  details: ReturnType<typeof z.flattenError>;
};

export type StandardApiError = {
  code: ServerErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiErrorResponse = ValidationApiError | StandardApiError;

export type FlattenedError<T extends z.ZodTypeAny> = ReturnType<
  typeof z.flattenError<z.infer<T>>
>;
