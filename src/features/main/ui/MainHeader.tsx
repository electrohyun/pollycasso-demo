import RoomFilterTabs from './RoomFilterTabs';
import SearchBar from '@/features/main/ui/SearchBar';
import NotificationButton from '@/features/main/ui/NotificationButton';
import CreateRoomButton from '@/features/main/ui/CreateRoomButton';

interface MainHeaderProps {
  searchQuery: string;
  onChangeSearch: (v: string) => void;
  onSearch: () => void;
  roomFilter: '전체' | '대기' | '개인' | '팀';
  onChangeFilter: (v: '전체' | '대기' | '개인' | '팀') => void;
  onClickCreateRoom: () => void;
}

export default function MainHeader({
  searchQuery,
  onChangeSearch,
  onSearch,
  roomFilter,
  onChangeFilter,
  onClickCreateRoom,
}: MainHeaderProps) {
  return (
    <div className="flex mt-[6px]">
      <SearchBar
        value={searchQuery}
        onChange={onChangeSearch}
        onSearch={onSearch}
      />
      <RoomFilterTabs currentFilter={roomFilter} onChange={onChangeFilter} />
      <NotificationButton />
      <CreateRoomButton onClick={onClickCreateRoom} />
    </div>
  );
}
