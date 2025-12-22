import type { MyItems } from '@/entities/game/model';
import { ALL_ITEMS_META, GAME_CONFIG } from '@/features/game/constants/game';
import { useMemo, useState } from 'react';

export const useInventory = (myItems: MyItems | null) => {
  const [startIndex, setStartIndex] = useState(0);

  const processedItems = useMemo(() => {
    const inventory = myItems?.inventory || {};

    return ALL_ITEMS_META.map((meta) => {
      const count = inventory[meta.id] || 0;
      return { ...meta, count, isOwned: count > 0 };
    });
  }, [myItems]);

  const visibleItems = processedItems.slice(
    startIndex,
    startIndex + GAME_CONFIG.ITEMS_PER_PAGE,
  );
  const canPrev = startIndex > 0;
  const canNext =
    startIndex + GAME_CONFIG.ITEMS_PER_PAGE < processedItems.length;

  const handlePrev = () => {
    if (canPrev) setStartIndex((prev) => prev - 1);
  };
  const handleNext = () => {
    if (canNext) setStartIndex((prev) => prev + 1);
  };

  return { visibleItems, handlePrev, handleNext, canPrev, canNext };
};
