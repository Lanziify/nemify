'use client';

import { create } from 'zustand';
import { authClient } from '@/utils/auth-client';
import type { Session, User } from 'better-auth/types';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  initSession: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false,

  initSession: async () => {
    set({ isLoading: true });
    try {
      const { data } = await authClient.getSession();
      if (data?.user && data?.session) {
        set({
          user: data.user,
          session: data.session,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          isInitialized: true,
          isLoading: false,
        });
      }
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

  logout: async () => {
    set({ isLoading: true });
    try {
      await authClient.signOut();
      set({
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to logout:', error);
      set({ isLoading: false });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
