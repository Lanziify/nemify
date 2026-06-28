import { auth } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';
import { apiErrorParser } from './errors/api-error-parser';
import { BadRequestError, UnAuthorizedError } from './errors/app-error';
import { PLATFORM_ROLES } from '@/lib/auth/roles';
import { isPlatformInitialized } from '@/utils/platform';

type Context = { params: Record<string, string | string[]> };

type ApiRouteHandler = (
  req: NextRequest,
  context: Context
) => Promise<NextResponse>;

type ApiGuard = (req: NextRequest, context: Context) => Promise<void>;

interface ApiHandlerOptions {
  guards?: ApiGuard[];
}

export const apiErrorHandler = (
  handler: ApiRouteHandler,
  options?: ApiHandlerOptions
): ApiRouteHandler => {
  return async (req: NextRequest, context: Context) => {
    try {
      if (options?.guards) {
        for (const guard of options.guards) {
          await guard(req, context);
        }
      }
      return await handler(req, context);
    } catch (error) {
      return apiErrorParser(error);
    }
  };
};

export const requiredUninitializedPlatform: ApiGuard = async (req) => {
  if (isPlatformInitialized()) {
    throw new BadRequestError('Platform is already initialized.');
  }
};

export const requiredSession: ApiGuard = async (req) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    throw new BadRequestError('Cannot perform request without active session.');
  }
};

export const requiredInternalKey: ApiGuard = async (req) => {
  const internalKey = req.headers.get('x-internal-secret-key');

  if (internalKey !== process.env.INTERNAL_SECRET) {
    throw new BadRequestError(
      'Cannot perform request. Secret key is required.'
    );
  }
};