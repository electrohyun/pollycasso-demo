import type { Outfit } from '@/shared/model';
import { getOutfitImageUrl, OUTFIT_LAYERS } from '@/shared/lib/cdn';
import { cn } from '@/shared/lib';

interface FinishedAvatarProps {
  outfit: Outfit;
  className?: string;
  imageClassName?: string;
}

export const FinishedAvatar = ({
  outfit,
  className,
  imageClassName,
}: FinishedAvatarProps) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {OUTFIT_LAYERS.map((layer) => {
        const partId = outfit[layer];
        if (!partId) return null;

        return (
          <img
            key={layer}
            src={getOutfitImageUrl(partId)}
            alt={layer}
            className={cn(
              'absolute inset-0 h-full w-full object-contain',
              imageClassName,
            )}
            style={{ zIndex: OUTFIT_LAYERS.indexOf(layer) }}
          />
        );
      })}
    </div>
  );
};
