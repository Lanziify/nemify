'use client';

import { create } from 'zustand';
import { SignInEmailPasswordValues } from '@/feature/auth/schema/auth.schema';
import {
  getUserCampusById,
  signInUserAccount,
  signOutUserAccount,
} from '@/feature/auth/actions/auth.action';
import { AuthType } from '@/utils/auth';
import { authClient } from '@/utils/auth-client';

interface AuthStore {
  user: AuthType['Session']['user'] | null;
  session: AuthType['Session']['session'] | null;
  campus: AuthType['ActiveOrganization'] | null;
  isLoading: boolean;
  isInitialized: boolean;
  setAuthSession: (session: AuthType['Session']) => Promise<void>;
  updateAuthSession: () => Promise<void>;
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
      const { data: campus, error } =
        await authClient.organization.getFullOrganization({
          query: {
            organizationId: data.session.activeOrganizationId,
          },
        });

      if (error) {
        console.error('Failed to fetch campus:', error);
      }

      campusData = campus;
    }

    set({
      user: data.user,
      session: data.session,
      campus: campusData,
    });
  },

  updateAuthSession: async () => {
    const { data } = await authClient.getSession();

    let campusData = null;

    if (data && data.session.activeOrganizationId) {
      const { data: campus, error } =
        await authClient.organization.getFullOrganization({
          query: {
            organizationId: data.session.activeOrganizationId,
          },
        });

      if (error) {
        console.error('Failed to fetch campus:', error);
      }

      campusData = campus;

      set({
        user: data.user,
        session: data.session,
        campus: campusData,
      });
    }
  },

  signIn: async (credentials) => {
    set({ isLoading: true });

    const result = await signInUserAccount(credentials);

    if (result.data) {
      let campusData = null;

      if (result.data.session.activeOrganizationId) {
        const { data, error } =
          await authClient.organization.getFullOrganization({
            query: {
              organizationId: result.data.session.activeOrganizationId,
            },
          });

        if (error) {
          console.error('Failed to fetch campus:', error);
        }

        campusData = data;
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
