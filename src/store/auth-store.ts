'use client';

import { create } from 'zustand';
import { authClient } from '@/utils/auth-client';
import type { Session, User } from 'better-auth/types';
import { LoginFormValues } from '@/components/custom/login-form';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;
  initSession: () => Promise<void>;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  error: null,
  isLoading: false,
  isInitialized: false,

  initSession: async () => {},

  login: async (credentials) => {},

  logout: async () => {},

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
