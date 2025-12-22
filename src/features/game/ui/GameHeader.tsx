import Marquee from 'react-fast-marquee';
import { UI_TEXT, COLORS, GAME_CONFIG } from '@/features/game/constants/game';

interface GameHeaderProps {
  theme: string | null;
  timer: number | null;
}

export const GameHeader = ({ theme, timer }: GameHeaderProps) => {
  const currentTimer = timer ?? 0;
  const timeProgress = (currentTimer / GAME_CONFIG.MAX_TIME) * 100;

  const timerStyle = {
    background: `conic-gradient(${COLORS.TIMER_GREEN} ${timeProgress}%, transparent 0)`,
    transform: 'scaleX(-1)',
  };

  return (
    <>
      <div
        className="mt-4 py-2 bg-opacity-50 text-black"
        style={{ backgroundColor: COLORS.NOTICE_BG }}
      >
        <Marquee gradient={false} speed={50}>
          <span className="mx-4 font-bold">{UI_TEXT.NOTICE}</span>
        </Marquee>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center w-full px-6">
        <div></div>

        <div className="text-center text-4xl font-bold truncate px-4">
          {UI_TEXT.THEME_PREFIX} {theme}
        </div>

        <div className="flex justify-end mr-2">
          <div className="flex flex-col items-center gap-1 pt-2">
            <div
              className="w-14 h-14 rounded-full bg-white shadow-sm border"
              style={{ ...timerStyle, borderColor: COLORS.TIMER_GREEN }}
            />
            <span
              className="font-bold text-lg font-ssrm"
              style={{ color: COLORS.TIMER_GREEN }}
            >
              {currentTimer}s
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
