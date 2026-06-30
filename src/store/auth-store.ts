'use client';

import { create } from 'zustand';

import { SignInEmailPasswordValues } from '@/feature/auth/schema/auth.schema';

import {
  signInUserAccount,
  signOutUserAccount,
} from '@/feature/auth/actions/auth.action';

import { AuthType } from '@/utils/auth';
import { authClient } from '@/utils/auth-client';

interface AuthStore {
  user: AuthType['Session']['user'] | null;
  session: AuthType['Session']['session'] | null;

  isLoading: boolean;
  isInitialized: boolean;

  setAuthSession: (session: AuthType['Session'] | null) => Promise<void>;

  updateAuthSession: () => Promise<void>;

  signIn: (
    credentials: SignInEmailPasswordValues
  ) => Promise<Awaited<ReturnType<typeof signInUserAccount>>>;

  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,

  isLoading: false,
  isInitialized: false,

  setAuthSession: async (data) => {
    set({
      user: data?.user ?? null,
      session: data?.session ?? null,
      isInitialized: true,
    });
  },

  updateAuthSession: async () => {
    set({
      isLoading: true,
    });

    const { data } = await authClient.getSession();

    set({
      user: data?.user ?? null,
      session: data?.session ?? null,
      isLoading: false,
      isInitialized: true,
    });
  },

  signIn: async (credentials) => {
    set({
      isLoading: true,
    });

    const result = await signInUserAccount(credentials);

    if (result.data) {
      set({
        user: result.data.user,
        session: result.data.session,
      });
    }

    set({
      isLoading: false,
      isInitialized: true,
    });

    return result;
  },

  signOut: async () => {
    set({
      isLoading: true,
    });

    await signOutUserAccount();

    set({
      user: null,
      session: null,
      isLoading: false,
      isInitialized: true,
    });
  },
}));
