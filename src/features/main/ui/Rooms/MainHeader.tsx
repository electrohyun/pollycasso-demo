import { RoomFilterTabs } from './RoomFilterTabs';
import { SearchBar } from './SearchBar';
import { NotificationButton } from './NotificationButton';
import { CreateRoomButton } from './CreateRoomButton';

interface MainHeaderProps {
  searchQuery: string;
  onChangeSearch: (v: string) => void;
  onSearch: () => void;
  roomFilter: '전체' | '대기' | '개인' | '팀';
  onChangeFilter: (v: '전체' | '대기' | '개인' | '팀') => void;
  onClickCreateRoom: () => void;
}

export const MainHeader = ({
  searchQuery,
  onChangeSearch,
  onSearch,
  roomFilter,
  onChangeFilter,
  onClickCreateRoom,
}: MainHeaderProps) => {
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
};
