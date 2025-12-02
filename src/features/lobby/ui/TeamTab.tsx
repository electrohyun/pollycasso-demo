import {
  ACTIVE_STYLE,
  DISABLED_STYLE,
  TEAM_COLORS,
} from '@/features/lobby/constants/colors';

interface TeamTabProps {
  teamId: 'BLUE' | 'RED';
  isMyTeam: boolean;
  position: 'top' | 'bottom';
  onClick: () => void;
}

export const TeamTab = ({
  teamId,
  isMyTeam,
  position,
  onClick,
}: TeamTabProps) => {
  const positionClass = position === 'top' ? 'top-[100px]' : 'bottom-[100px]';

  const colorClass = isMyTeam
    ? DISABLED_STYLE
    : `bg-gradient-to-b ${TEAM_COLORS[teamId]} ${ACTIVE_STYLE}`;

  return (
    <button
      onClick={onClick}
      disabled={isMyTeam}
      className={`absolute ${positionClass} -left-10 w-10 py-8 rounded-l-2xl flex flex-col items-center justify-center text-lg leading-5 z-10 ${colorClass}`}
    >
      {'팀바꾸기'.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </button>
  );
};
