import { XMarkIcon } from '@heroicons/react/24/solid';

import { Crown } from '@/assets';
import { cn } from '@/shared/lib';
import ScalableText from './ScalableText';
import { getOutfitImageUrl, OUTFIT_LAYERS } from '@/shared/lib/cdn';
import type { Player } from '@/shared/model';

interface PlayerSlotProps {
  player?: Player;
  isHost: boolean;
  canKick: boolean;
  onKick: () => void;
  className?: string;
}

export const PlayerSlot = ({
  player,
  isHost,
  canKick,
  onKick,
  className,
}: PlayerSlotProps) => {
  if (!player) {
    return (
      <div className="px-4 pt-6 rounded-2xl bg-black/20">
        <div className="flex justify-between items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-black/20"></div>
          <div className="w-36 h-9 rounded-full bg-black/20"></div>
        </div>
        <div className="w-full h-[200px] aspect-square rounded-lg bg-black/20"></div>
      </div>
    );
  }

  const isReadyVisual = player.isReady || isHost;
  const playerOutfit = player.outfit;

  return (
    <div
      className={cn(
        'w-full px-4 pt-6 rounded-2xl bg-white relative group',
        className,
      )}
    >
      {canKick && (
        <button
          onClick={onKick}
          className={cn(
            'absolute -top-3 -right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-[#FF553F] border-2 border-white text-white shadow-md transition-all duration-200',
            'hover:bg-[#FF331F] hover:scale-110 active:scale-95',
          )}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex justify-center items-center shrink-0 w-10 h-10 rounded-full bg-[#82DC99] text-white font-bold text-lg shadow-sm">
            {isHost && (
              <img
                src={Crown}
                alt="방장 왕관"
                className="absolute -top-5 left-1/2 -translate-x-1/2 w-7 h-auto z-10 drop-shadow-sm pointer-events-none"
              />
            )}
            {player.level}
          </div>
          <div className="flex-1 min-w-0 text-2xl font-bold text-gray-800">
            <ScalableText>{player.nickname}</ScalableText>
          </div>
        </div>

        {!isHost && (
          <div className="shrink-0 ml-2">
            {player.isReady ? (
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-md font-bold text-white bg-[#2ADB75]',
                )}
              >
                준비
              </span>
            ) : (
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-md font-bold bg-gray-200 text-gray-500',
                )}
              >
                대기
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          'relative flex items-center justify-center w-full h-[220px] aspect-square overflow-hidden bg-[#E3DDDD] rounded-lg border-[5px] transition-all duration-300 box-border',
          isReadyVisual ? 'border-[#2ADB75]' : 'border-transparent',
        )}
      >
        {OUTFIT_LAYERS.map((layer) => {
          const partId = playerOutfit[layer];

          if (!partId) return null;

          return (
            <img
              key={layer}
              src={getOutfitImageUrl(partId)}
              alt={layer}
              className="absolute inset-0 w-full h-[200px] object-contain"
              style={{
                zIndex: OUTFIT_LAYERS.indexOf(layer),
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
