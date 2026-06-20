import { getUserCampusList } from '@/feature/multi-tenancy/actions/tenancy.action';
import { authClient } from '@/utils/auth-client';
import { create } from 'zustand';

interface CampusStore {
  campus: (typeof authClient.$Infer.Organization)[] | null;
  isLoading: boolean;
  isInitialized: boolean;
  initCampus: () => Promise<void>;
}

export const useCampusStore = create<CampusStore>((set, get) => ({
  campus: null,
  isLoading: false,
  isInitialized: false,

  initCampus: async () => {
    if (get().isInitialized || get().isLoading) {
      return;
    }

    set({ isLoading: true });
    const result = await getUserCampusList();

    if (result.data) {
      set({
        campus: result.data,
        isInitialized: true,
        isLoading: false,
      });
    }

    if (result.error) {
      set({
        campus: null,
        isInitialized: true,
        isLoading: false,
      });
    }
  },
}));
