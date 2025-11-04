import { useAuthStore } from '@/features/auth/model';
import { useMain } from '@/features/main/model/useMain';
import { useChat } from '@/features/main/model/useChat';

import CreateRoomModal from '@/features/main/ui/CreateRoomModal';
import Sidebar from '@/features/main/ui/SideBar';
import RoomList from '@/features/main/ui/RoomList';
import ChatBox from '@/features/main/ui/ChatBox';
import MainHeader from '@/features/main/ui/MainHeader';

import { mockRooms } from '@/features/main/constants/mainData';
import { useState } from 'react';

const MainPage = () => {
  const { clearAuth } = useAuthStore();
  const {
    searchQuery,
    setSearchQuery,
    roomFilter,
    setRoomFilter,
    commitSearch,
    setCommitSearch,
  } = useMain();

  const {
    messages,
    input,
    selected,
    isMentionOpen,
    filteredFriends,
    highlightIndex,
    messagesEndRef,
    handleMentionOpen,
    handleMentionSelect,
    handleKeyDown,
    sendMessage,
    setIsComposing,
    selectChannel,
  } = useChat();

  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const currentLv = 1;
  const nickname = '밥아저씨';
  const currentXp = 30;
  const maxXp = 50;

  const handleLogout = () => clearAuth();
  const handleSearch = () => setCommitSearch(searchQuery.trim());

  // 방 목록 필터링
  const filteredRooms = mockRooms.filter((room) => {
    const filterMatch =
      roomFilter === '전체' ||
      (roomFilter === '대기' && room.status === 'WAITING') ||
      (roomFilter === '개인' && room.mode === 'SOLO') ||
      (roomFilter === '팀' && room.mode === 'TEAM');

    const search = commitSearch.trim().toLowerCase();
    const searchMatch =
      !search ||
      room.name.toLowerCase().includes(search) ||
      room.id.toString().includes(search);

    return filterMatch && searchMatch;
  });

  return (
    <div className="flex items-center justify-center min-w-[1500px] mx-auto min-h-screen gap-x-10 font-ssrm font-bold">
      {/* 왼쪽 사이드바 */}
      <Sidebar
        nickname={nickname}
        level={currentLv}
        currentXp={currentXp}
        maxXp={maxXp}
        onLogout={handleLogout}
      />

      {/* 메인 컨텐츠 */}
      <div className="w-[1100px] h-[760px] px-10 py-10 rounded-3xl bg-[#1E3411]/40">
        {/* 상단 헤더 */}
        <MainHeader
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
          onSearch={handleSearch}
          roomFilter={roomFilter}
          onChangeFilter={setRoomFilter}
          onClickCreateRoom={() => setIsCreateRoomModalOpen(true)}
        />

        {/* 방 리스트 */}
        <RoomList
          rooms={filteredRooms}
          onEnter={(id) => console.log(`방 입장: ${id}`)}
          onMenu={(id) => console.log(`메뉴 클릭: ${id}`)}
        />

        {/* 채팅 */}
        <ChatBox
          messages={messages}
          input={input}
          selectedChannel={selected}
          isDropdownOpen={isChannelDropdownOpen}
          isMentionOpen={isMentionOpen}
          filteredFriends={filteredFriends}
          highlightIndex={highlightIndex}
          messagesEndRef={messagesEndRef}
          onChangeInput={handleMentionOpen}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
          setIsComposing={setIsComposing}
          onChannelToggle={() => setIsChannelDropdownOpen((p) => !p)}
          onSelectChannel={(value) => {
            selectChannel(value);
            setIsChannelDropdownOpen(false);
          }}
          onSelectMention={handleMentionSelect}
        />
      </div>

      {isCreateRoomModalOpen && (
        <CreateRoomModal onClose={() => setIsCreateRoomModalOpen(false)} />
      )}
    </div>
  );
};

export default MainPage;
