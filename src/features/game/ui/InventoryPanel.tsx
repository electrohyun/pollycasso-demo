import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

import type { GameItem, ItemIconProps } from '@/entities/game';
import { ItemIcon } from '@/entities/game';
import { cn } from '@/shared/lib';
import { COLORS, UI_TEXT } from '../constants/game';
import { useInventory } from './useInventory';

interface InventoryPanelProps {
  inventory: GameItem[] | null;
  onComplete?: () => void;
}

export const InventoryPanel = ({
  inventory,
  onComplete,
}: InventoryPanelProps) => {
  const { visibleItems, handlePrev, handleNext, canPrev, canNext } =
    useInventory(inventory ?? []);

  return (
    <aside className="h-auto flex flex-col gap-4">
      <div
        className="py-8 px-8 rounded-2xl flex flex-col gap-4 items-center justify-center min-w-[140px]"
        style={{ backgroundColor: COLORS.PRIMARY_DARK }}
      >
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          className={cn(
            'transition-all p-1',
            canPrev
              ? 'text-white hover:text-green-200 hover:-translate-y-1'
              : 'text-white/30 cursor-not-allowed',
          )}
        >
          <ChevronUpIcon className="w-10 h-10 stroke-2" />
        </button>

        <div className="flex flex-col gap-6 my-2 h-[450px]">
          {/* TODO: 데이터 전용 타입 설계 */}
          {visibleItems.map((item: ItemIconProps) => (
            <ItemIcon key={item.id} {...item} />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!canNext}
          className={cn(
            'transition-all p-1',
            canNext
              ? 'text-white hover:text-green-200 hover:translate-y-1'
              : 'text-white/30 cursor-not-allowed',
          )}
        >
          <ChevronDownIcon className="w-10 h-10 stroke-2" />
        </button>
      </div>

      <button
        onClick={onComplete}
        className={cn(
          'w-full h-14 bg-white rounded-full text-xl font-extrabold shadow-lg',
          'hover:bg-gray-100 transition-colors',
        )}
        style={{ color: COLORS.PRIMARY_DARK }}
      >
        {UI_TEXT.BTN_COMPLETE}
      </button>
    </aside>
  );
};
