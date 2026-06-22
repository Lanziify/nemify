'use server';

import { auth } from '@/utils/auth';
import { SignInEmailPasswordValues } from '../schema/auth.schema';
import { actionErrorParser } from '@/lib/errors/action-error-parser';
import { safeCatch } from '@/lib/errors/safe-catch';
import { headers } from 'next/headers';
import { ServerError } from '@/lib/errors/app-error';

export const signInUserAccount = async (values: SignInEmailPasswordValues) => {
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

      const newHeaders = new Headers(currentHeaders);
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
        ...response,
        session: sessionResponse.session,
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

export const getUserCampusById = async (id: string) => {
  return await safeCatch(
    async () => {
      return await auth.api.getFullOrganization({
        query: {
          organizationId: id,
        },
        headers: await headers(),
      });
    },
    { parser: actionErrorParser }
  );
};

export const getAuthSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};
