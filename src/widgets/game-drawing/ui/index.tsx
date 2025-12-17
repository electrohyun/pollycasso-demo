import { useMemo, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { GAME_DATA } from '@/mocks/game.mock';

interface ItemMeta {
  id: string;
  name: string;
}

const COLORS = {
  PRIMARY_DARK: '#003D00',
  TIMER_GREEN: '#0ABC22',
  NOTICE_BG: '#D9D9D9',
  NOTICE_TEXT: '#000000',
};

const GAME_CONFIG = {
  MAX_TIME: 90,
  ITEMS_PER_PAGE: 5,
};

const UI_TEXT = {
  NOTICE: '📢 [공지] 서버 안정화 작업이 예정되어 있습니다.',
  THEME_PREFIX: '주제: ',
  BTN_COMPLETE: '완료',
};

const ALL_ITEMS_META: ItemMeta[] = [
  { id: 'ink_splash', name: '먹물' },
  { id: 'blur', name: '블러' },
  { id: 'brush', name: '붓' },
  { id: 'palette', name: '팔레트' },
  { id: 'canvas', name: '캔버스' },
  { id: 'easel', name: '이젤' },
  { id: 'bucket', name: '물통' },
  { id: 'reflection', name: '반사' },
];

const GameWidget = () => {
  const { players, myItems, timer, currentTheme } = GAME_DATA;
  const [startIndex, setStartIndex] = useState(0);

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'bg-red-500';
    if (level >= 10) return 'bg-yellow-400';
    return 'bg-green-500';
  };

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

  const currentTimer = timer ?? 0;
  const timeProgress = (currentTimer / GAME_CONFIG.MAX_TIME) * 100;
  const timerStyle = {
    background: `conic-gradient(${COLORS.TIMER_GREEN} ${timeProgress}%, transparent 0)`,
    transform: 'scaleX(-1)',
  };

  return (
    <div className="w-full h-screen flex justify-between items-center font-ssrm px-20 py-4 overflow-hidden gap-16 ">
      <aside
        className="py-16 px-8 w-auto h-auto rounded-2xl flex flex-col gap-6 justify-center min-w-[120px]"
        style={{ backgroundColor: COLORS.PRIMARY_DARK }}
      >
        {players.map((player) => (
          <div key={player.userId} className="flex flex-col items-center">
            <div className="relative w-[70px] h-[70px] bg-white rounded-full mx-auto shadow-md">
              <div
                className={`absolute -top-2 -left-2 w-8 h-8 rounded-full border-2 border-[#003D00] ${getLevelColor(player.level)}`}
              />
            </div>
            <p className="text-center mt-2 text-white font-bold truncate w-20">
              {player.nickname}
            </p>
          </div>
        ))}
      </aside>

      <main className="w-full h-full rounded-3xl bg-white shadow-xl flex flex-col relative overflow-hidden">
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
            {UI_TEXT.THEME_PREFIX} {currentTheme}
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

        <div className="flex-1 flex items-center justify-center text-gray-300 bg-gray-50 m-6 rounded-xl border border-dashed border-gray-300">
          Canvas Area
        </div>
      </main>

      <aside className="h-auto flex flex-col gap-4">
        <div
          className="py-8 px-8 rounded-2xl flex flex-col gap-4 items-center justify-center min-w-[140px]"
          style={{ backgroundColor: COLORS.PRIMARY_DARK }}
        >
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            className={`transition-all p-1 ${
              canPrev
                ? 'text-white hover:text-green-200 hover:-translate-y-1'
                : 'text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronUpIcon className="w-10 h-10 stroke-2" />
          </button>

          <div className="flex flex-col gap-6 my-2 h-[450px]">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center animate-fadeIn transition-all ${
                  item.isOwned ? 'opacity-100' : 'opacity-40 grayscale'
                }`}
              >
                <div
                  className={`relative w-[70px] h-[70px] rounded-full mx-auto shadow-md flex items-center justify-center font-bold text-sm select-none transition-transform
                    ${
                      item.isOwned
                        ? 'bg-white text-gray-700 hover:scale-105 cursor-pointer hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed inner-shadow'
                    }`}
                >
                  {item.name}

                  {item.isOwned && (
                    <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                      x{item.count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canNext}
            className={`transition-all p-1 ${
              canNext
                ? 'text-white hover:text-green-200 hover:translate-y-1'
                : 'text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronDownIcon className="w-10 h-10 stroke-2" />
          </button>
        </div>

        <button
          className="w-full h-14 bg-white rounded-full text-xl font-extrabold shadow-lg hover:bg-gray-100 transition-colors"
          style={{ color: COLORS.PRIMARY_DARK }}
        >
          {UI_TEXT.BTN_COMPLETE}
        </button>
      </aside>
    </div>
  );
};

export default GameWidget;
