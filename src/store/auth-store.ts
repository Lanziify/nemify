'use client';

import { create } from 'zustand';
import { SignInEmailPasswordValues } from '@/feature/auth/schema/auth.schema';
import {
  getUserCampusById,
  signInUserAccount,
  signOutUserAccount,
} from '@/feature/auth/actions/auth.action';
import { AuthType } from '@/utils/auth';

interface AuthStore {
  user: AuthType['Session']['user'] | null;
  session: AuthType['Session']['session'] | null;
  campus: AuthType['ActiveOrganization'] | null;
  isLoading: boolean;
  isInitialized: boolean;
  setAuthSession: (session: AuthType['Session']) => Promise<void>;
  signIn: (
    credentials: SignInEmailPasswordValues
  ) => Promise<Awaited<ReturnType<typeof signInUserAccount>>>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  campus: null,
  isLoading: false,
  isInitialized: false,

  setAuthSession: async (data) => {
    let campusData = null;

    if (data.session.activeOrganizationId) {
      const { data: campus } = await getUserCampusById(
        data.session.activeOrganizationId
      );

      campusData = campus;
    }

    set({
      user: data.user,
      session: data.session,
      campus: campusData,
    });
  },

  signIn: async (credentials) => {
    set({ isLoading: true });

    const result = await signInUserAccount(credentials);

    if (result.data) {
      let campusData = null;

      if (result.data.session.activeOrganizationId) {
        const { data: campus } = await getUserCampusById(
          result.data.session.activeOrganizationId
        );

        campusData = campus;
      }

      set({
        user: result.data.user,
        session: result.data.session,
        campus: campusData,
        isLoading: false,
      });
    }

    if (result.error) {
      set({
        user: null,
        session: null,
        campus: null,
        isLoading: false,
      });
    }

    return result;
  },

  signOut: async () => {
    set({ isLoading: true });

    await signOutUserAccount();

    set({
      user: null,
      session: null,
      campus: null,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
