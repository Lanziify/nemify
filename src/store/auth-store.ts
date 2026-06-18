'use client';

import { create } from 'zustand';
import type { Session, User } from 'better-auth/types';
import { SignUpEmailValues } from '@/feature/auth/schema/auth.schema';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;
  initSession: () => Promise<void>;
  login: (credentials: SignUpEmailValues) => Promise<void>;
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
