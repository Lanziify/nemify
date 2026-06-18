import { AppErrorCode, getErrorMessage } from './error-codes';

interface ErrorMetadata extends ErrorOptions {
  details?: Record<string, unknown>;
}

interface AppErrorOptions extends ErrorMetadata {
  errorCode: AppErrorCode;
  statusCode: number;
}

export class AppError extends Error {
  errorCode: AppErrorCode | undefined;
  statusCode: number | undefined;
  details?: Record<string, unknown>;

  constructor(message: string, options?: AppErrorOptions) {
    super(message, options);

    this.name = new.target.name;
    this.errorCode = options?.errorCode;
    this.statusCode = options?.statusCode;
    this.details = options?.details;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message?: string, options?: ErrorMetadata) {
    super(message ?? getErrorMessage('BAD_REQUEST'), {
      errorCode: 'BAD_REQUEST',
      statusCode: 400,
      ...options,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string, options?: ErrorMetadata) {
    super(message ?? getErrorMessage('UNAUTHORIZED_ACCESS'), {
      errorCode: 'UNAUTHORIZED_ACCESS',
      statusCode: 401,
      ...options,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, options?: ErrorMetadata) {
    super(message ?? getErrorMessage('REQUEST_FORBIDDEN'), {
      errorCode: 'REQUEST_FORBIDDEN',
      statusCode: 403,
      ...options,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string, options?: ErrorMetadata) {
    super(message ?? getErrorMessage('RESOURCE_NOT_FOUND'), {
      errorCode: 'RESOURCE_NOT_FOUND',
      statusCode: 404,
      ...options,
    });
  }
}
