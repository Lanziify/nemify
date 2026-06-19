'use client';

import { create } from 'zustand';
import type { Session, User } from 'better-auth/types';
import { SignInEmailPasswordValues } from '@/feature/auth/schema/auth.schema';
import {
  signInUserAccount,
  signOutUserAccount,
} from '@/feature/auth/actions/auth.action';
import { authClient } from '@/utils/auth-client';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  initSession: () => Promise<void>;
  signIn: (
    credentials: SignInEmailPasswordValues
  ) => Promise<Awaited<ReturnType<typeof signInUserAccount>>>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,

  initSession: async () => {
    // Skip if already initialized or currently loading
    if (get().isInitialized || get().isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const { data } = await authClient.getSession();
      set({
        user: data?.user ?? null,
        session: data?.session ?? null,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize session:', error);
      set({
        user: null,
        session: null,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  signIn: async (credentials) => {
    set({ isLoading: true });
    const result = await signInUserAccount(credentials);

    if (result.data) {
      // Re-fetch session to get complete data
      const { data } = await authClient.getSession();
      set({
        user: data?.user ?? null,
        session: data?.session ?? null,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }

    return result;
  },

  signOut: async () => {
    set({ isLoading: true });
    await signOutUserAccount();
    set({
      user: null,
      session: null,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
