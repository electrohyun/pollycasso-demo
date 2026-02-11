import { queryOptions } from '@tanstack/react-query';

import { getConsumables } from '@/features/shop/api/getConsumables';
import { getCosmetics } from '@/features/shop/api/getCosmetics';
import { getUserInventory } from '@/features/shop/api/getUserInventory';

export const shopQueries = {
  all: () => ['shop'] as const,

  consumables: () =>
    queryOptions({
      queryKey: [...shopQueries.all(), 'consumables'] as const,
      queryFn: getConsumables,
    }),

  cosmetics: () =>
    queryOptions({
      queryKey: [...shopQueries.all(), 'cosmetics'] as const,
      queryFn: getCosmetics,
    }),

  inventory: () =>
    queryOptions({
      queryKey: [...shopQueries.all(), 'inventory'] as const,
      queryFn: getUserInventory,
    }),
};
