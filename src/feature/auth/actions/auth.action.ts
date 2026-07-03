'use server';

import { auth } from '@/utils/auth';
import {
  SignInEmailPasswordValues,
  SignUpEmailValues,
} from '../schema/auth.schema';
import { actionErrorParser } from '@/lib/errors/action-error-parser';
import { safeCatch } from '@/lib/errors/safe-catch';
import { headers } from 'next/headers';
import { ServerError } from '@/lib/errors/app-error';
import {
  AuthRepository,
  updatePlatformInitState,
} from '../repositories/auth.repository';
import { PLATFORM_ROLES } from '@/lib/auth/roles';
import { setPlatformInitialized } from '@/utils/platform';

export async function getSessionFromHeaders(
  headers: Headers,
  responseHeaders: Headers
) {
  const newHeaders = new Headers(headers);
  const setCookie = responseHeaders.get('set-cookie');
  if (setCookie) {
    newHeaders.set('cookie', setCookie);
  }

  const sessionResponse = await auth.api.getSession({
    headers: newHeaders,
  });

  if (!sessionResponse) {
    throw new ServerError('Failed to establish session.');
  }

  return {
    session: sessionResponse.session,
  };
}

export const signUpAdminAccount = async (values: SignUpEmailValues) => {
  return await safeCatch(
    async () => {
      const response = await auth.api.signUpEmail({
        body: values,
      });

      const authRepository = new AuthRepository();
      await authRepository.setUserRole(response.user.id, PLATFORM_ROLES.admin);

      return response;
    },
    { parser: actionErrorParser }
  );
};

export const signUpUserAccount = async (values: SignUpEmailValues) => {
  return await safeCatch(
    async () => {
      return await auth.api.signUpEmail({
        body: values,
        returnHeaders: true,
      });
    },
    { parser: actionErrorParser }
  );
};

export const signInUserAccount = async (
  values: SignInEmailPasswordValues,
  options?: { returnHeaders: boolean }
) => {
  return await safeCatch(
    async () => {
      const currentHeaders = await headers();

      const { headers: responseHeaders, response } = await auth.api.signInEmail(
        {
          body: values,
          headers: currentHeaders,
          returnHeaders: true,
        }
      );

      const { session } = await getSessionFromHeaders(
        currentHeaders,
        responseHeaders
      );

      return {
        session,
        ...response,
        ...(options?.returnHeaders ? { headers: responseHeaders } : {}),
      };
    },
    { parser: actionErrorParser }
  );
};

export const signOutUserAccount = async () => {
  return await safeCatch(
    async () => {
      return await auth.api.signOut({
        headers: await headers(),
      });
    },
    { parser: actionErrorParser }
  );
};

export const getSessionData = async () => {
  return await safeCatch(
    async () => {
      return await auth.api.getSession({ headers: await headers() });
    },
    {
      parser: actionErrorParser,
    }
  );
};

export const updatePlatformState = async (id: string) => {
  await updatePlatformInitState(id);
  setPlatformInitialized(true);
};
