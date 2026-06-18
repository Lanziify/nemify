import { auth } from '@/utils/auth';
import { authClient } from '@/utils/auth-client';

export type ClientAuthErrorCode = keyof typeof authClient.$ERROR_CODES;

export type ApiAuthErrorCodes = keyof typeof auth.$ERROR_CODES;

// export type ServerErrorCode =
//   | 'BAD_REQUEST'
//   | 'UNAUTHORIZED_ACCESS'
//   | 'REQUEST_FORBIDDEN'
//   | 'RESOURCE_NOT_FOUND';

// export type AppErrorCode =
//   | ServerErrorCode
//   | ApiAuthErrorCodes
//   | ClientAuthErrorCode
//   | 'VALIDATION_ERROR';

// export const ERROR_MESSAGES = {
//   BAD_REQUEST: 'Bad request',
//   UNAUTHORIZED_ACCESS: 'Unauthorized access',
//   REQUEST_FORBIDDEN: 'Forbidden',
//   RESOURCE_NOT_FOUND: 'Resource not found',
//   VALIDATION_ERROR: 'Validation failed',
// } satisfies Partial<Record<AppErrorCode, string>>;

// export const getErrorMessage = (code: AppErrorCode) => {
//   return (
//     ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ??
//     'Something went wrong'
//   );
// };
