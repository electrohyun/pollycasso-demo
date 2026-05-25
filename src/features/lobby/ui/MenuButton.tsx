import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { COLOR_MAP } from '../constants/colors';

interface MenuButtonProps {
  icon: ReactNode;
  label: string;
  color: 'RED' | 'YELLOW' | 'BLACK';
  onClick?: () => void;
  disabled?: boolean;
}

export const MenuButton = ({
  icon,
  label,
  color,
  onClick,
  disabled = false,
}: MenuButtonProps) => {
  return (
    <div className="p-2 bg-white/50 rounded-xl h-full">
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'flex justify-between w-full h-full items-center py-2 px-4 rounded-xl transition-colors',
          disabled
            ? 'bg-gray-500 text-white/60 cursor-not-allowed opacity-70'
            : COLOR_MAP[color],
        )}
      >
        <div className="w-8 h-8 text-white">{icon}</div>
        <span className="text-2xl font-bold text-white">{label}</span>
      </button>
    </div>
  );
};
