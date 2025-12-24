import { cn } from '@/shared/lib';
import { COLORS, UI_TEXT } from '../constants/game';

interface GameSubmitButtonProps {
  onComplete?: () => void;
  completedCount: number;
  totalCount: number;
  isReady: boolean; // 상태 추가
}

export const GameSubmitButton = ({
  onComplete,
  completedCount,
  totalCount,
  isReady,
}: GameSubmitButtonProps) => {
  return (
    <div className="relative w-full mt-4">
      {/* 현황 배지 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-7 px-6 py-2 rounded-t-xl text-white font-bold text-sm shadow-md flex items-center justify-center z-0 whitespace-nowrap"
        style={{ backgroundColor: COLORS.BADGE_PINK }}
      >
        {completedCount}/{totalCount} 완료
      </div>

      {/* 버튼 */}
      <button
        onClick={onComplete}
        className={cn(
          // 보내주신 스타일 유지 (w-[110%] -left-[5%])
          'relative z-10 w-[110%] -left-[5%] h-16 rounded-full text-2xl font-extrabold shadow-lg',
          'hover:brightness-95 transition-all active:scale-95',
          // 상태에 따른 텍스트 색상 변경
          isReady ? 'text-white' : 'bg-white text-black',
        )}
        style={{
          // 준비 완료 상태일 때만 빨간색 배경 적용
          backgroundColor: isReady ? COLORS.TIMER_RED : undefined,
        }}
      >
        {/* 상태에 따른 텍스트 변경 */}
        {isReady ? '취소' : UI_TEXT.BTN_COMPLETE}
      </button>
    </div>
  );
};
