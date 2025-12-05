import { flatMap } from '@modern-kit/utils';
import { useRoomsQuery } from '@/features/main/model/useRoomsQuery';
import { RoomCard } from './RoomCard';
import { Spinner } from '@/shared/ui/Spinner';

interface Props {
  onEnter: (id: number) => void;
  onMenu: (id: number) => void;
}

export const RoomList = ({ onEnter, onMenu }: Props) => {
  const {
    data,
    isLoading, // 실제 로딩 상태
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useRoomsQuery();

  const rooms = flatMap(data?.pages ?? [], (page) => page.rooms);

  const renderContent = () => {
    if (isError) {
      return (
        <div className="col-span-2 flex flex-col items-center justify-center py-44">
          <span className="text-white text-3xl font-bold drop-shadow">
            오류가 발생했습니다.
          </span>
        </div>
      );
    }

    if (rooms.length === 0) {
      return (
        <div className="col-span-2 flex flex-col items-center justify-center py-44">
          <span className="text-white text-3xl font-bold drop-shadow">
            방을 만들어주세요!
          </span>
        </div>
      );
    }

    return rooms.map((room) => (
      <RoomCard
        key={room.id}
        room={room}
        onEnterRoom={() => onEnter(room.id)}
        onOpenMenu={() => onMenu(room.id)}
      />
    ));
  };

  return (
    <div
      className="
        relative
        mt-5 h-[400px] rounded-2xl overflow-y-auto pr-3
        scrollbar 
        scrollbar-thumb-white 
        hover:scrollbar-thumb-white/90
        scrollbar-thumb-rounded-full
        scrollbar-w-5
        scrollbar-border-2
        scrollbar-stable
      "
    >
      {isLoading ? (
        <Spinner transparent={true} message="방 목록을 불러오는 중..." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-3xl">
            {renderContent()}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-4 mb-2">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-white/30 text-white text-xl font-bold rounded-lg
                           hover:bg-white/40 disabled:opacity-50 min-w-[140px]"
              >
                {isFetchingNextPage ? (
                  <>
                    <Spinner overlay={false} size="sm" transparent={true} />
                    <span>불러오는 중...</span>
                  </>
                ) : (
                  '더보기'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
