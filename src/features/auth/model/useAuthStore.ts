import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from './types';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
