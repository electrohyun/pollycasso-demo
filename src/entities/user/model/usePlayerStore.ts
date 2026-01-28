import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  level: number;
  exp: number;
  maxExp: number;
  coin: number;

  addCoin: (amount: number) => void;
  subtractCoin: (amount: number) => boolean;
  addExp: (amount: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      level: 3,
      exp: 1500,
      maxExp: 5000,
      coin: 200,

      addCoin: (amount) => set((state) => ({ coin: state.coin + amount })),

      subtractCoin: (amount) => {
        const { coin } = get();
        if (coin < amount) return false;
        set({ coin: coin - amount });
        return true;
      },

      addExp: (amount) =>
        set((state) => {
          const newExp = state.exp + amount;
          if (newExp >= state.maxExp) {
            return {
              level: state.level + 1,
              exp: newExp - state.maxExp,
              maxExp: state.maxExp * 1.2,
            };
          }
          return { exp: newExp };
        }),
    }),
    {
      name: 'player-storage',
    },
  ),
);
