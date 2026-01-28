import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/entities/product';

interface WardrobeState {
  equippedItems: Product[];
  ownedItemIds: number[];

  equipItem: (item: Product) => void;
  unequipItem: (itemId: number) => void;
  purchaseItem: (item: Product) => void;
  isOwned: (itemId: number) => boolean;
}

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      equippedItems: [],
      ownedItemIds: [],

      equipItem: (newItem) =>
        set((state) => {
          const filtered = state.equippedItems.filter(
            (item) => item.subCategory !== newItem.subCategory,
          );
          return { equippedItems: [...filtered, newItem] };
        }),

      unequipItem: (itemId) =>
        set((state) => ({
          equippedItems: state.equippedItems.filter((i) => i.id !== itemId),
        })),

      purchaseItem: (item) =>
        set((state) => {
          if (state.ownedItemIds.includes(item.id)) return state;
          return { ownedItemIds: [...state.ownedItemIds, item.id] };
        }),

      isOwned: (itemId) => get().ownedItemIds.includes(itemId),
    }),
    {
      name: 'wardrobe-storage',
    },
  ),
);
