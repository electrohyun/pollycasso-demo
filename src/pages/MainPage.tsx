import { useAuthStore } from '@/features/auth/model';
import CreateRoomModal from '@/features/main/ui/CreateRoomModal';
import { MentionDropdown } from '@/features/main/ui/MentionDropdown';
import {
  EllipsisVerticalIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowUpIcon,
  BellIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

interface Friend {
  id: number;
  name: string;
}

interface ChatMessage {
  channel: '전체' | '친구';
  text: string;
  targetNickname?: string;
}

const LobbyPage = () => {
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
  };

  const rooms = [
    {
      id: 2103,
      title: '밥아저씨 컴온!',
      mode: '개인',
      current: 1,
      max: 4,
      status: '대기중',
      isLocked: false,
    },
    {
      id: 3332,
      title: '하하하하하하하',
      mode: '개인',
      current: 4,
      max: 4,
      status: '게임중',
      isLocked: false,
    },
    {
      id: 7810,
      title: '고수만 와라',
      mode: '개인',
      current: 2,
      max: 4,
      status: '대기중',
      isLocked: true,
    },
    {
      id: 5521,
      title: '랜덤팀전 ㄱ?',
      mode: '팀',
      current: 6,
      max: 8,
      status: '대기중',
      isLocked: false,
    },
    {
      id: 9980,
      title: '숨 막히는 전략전',
      mode: '팀',
      current: 8,
      max: 8,
      status: '게임중',
      isLocked: true,
    },
    {
      id: 4411,
      title: '편하게 즐겨요~',
      mode: '개인',
      current: 3,
      max: 4,
      status: '대기중',
      isLocked: false,
    },
    {
      id: 6666,
      title: '뾰롱',
      mode: '개인',
      current: 4,
      max: 4,
      status: '대기중',
      isLocked: false,
    },
  ];

  const channels = [
    { label: '[전체]', value: '전체' },
    { label: '[친구]', value: '친구' },
  ];

  const friends = [
    { id: 1, name: '레전드프론트엔드' },
    { id: 2, name: '레전드백엔드' },
    { id: 3, name: 'aa1' },
    { id: 4, name: 'a' },
    { id: 5, name: 'asdf11' },
  ];

  const currentLv = 1;
  const nickname = '밥아저씨';
  const currentXp = 30;
  const maxXp = 50;
  const progress = (currentXp / maxXp) * 100;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(channels[0]);
  const [isMentionOpen, setIsMentionOpen] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(friends);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<'전체' | '대기' | '개인' | '팀'>(
    '전체',
  );
  const [commitSearch, setCommitSearch] = useState('');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const handleSearch = () => {
    setCommitSearch(searchQuery.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 1. (수정) 한글 등 IME 조합 중에는 Enter 키 입력을 즉시 무시
    if (isComposing) {
      return;
    }

    // 2. 멘션 모드일 때 (방향키, 엔터)
    if (isMentionOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev + 1 < filteredFriends.length ? prev + 1 : 0,
        );
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev - 1 >= 0 ? prev - 1 : filteredFriends.length - 1,
        );
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const friend = filteredFriends[highlightIndex];
        if (friend) {
          handleMentionSelect(friend);
          return; // 멘션 선택 후 메시지 전송 로직으로 넘어가지 않게 return
        }
      }
    }

    // 3. 멘션 모드가 *아닐 때* + *IME 조합 중이 아닐 때* 메시지 전송
    if (!isMentionOpen && e.key === 'Enter') {
      e.preventDefault();
      if (!isComposing) {
        sendMessage();
      }
    }
  };

  const handleMentionOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex === -1) {
      setIsMentionOpen(false);
      setSelected(channels[0]);
      return;
    }

    const mentionCandidate = value.slice(lastAtIndex + 1);

    // @ 단독이면 전체 리스트
    if (mentionCandidate === '') {
      setFilteredFriends(friends);
      setIsMentionOpen(true);
      setHighlightIndex(0);
      setSelected(channels[1]);
      return;
    }

    // 허용 문자: 한글/영문/숫자
    const valid = /^[a-zA-Z0-9가-힣]+$/.test(mentionCandidate);

    if (!valid) {
      setIsMentionOpen(false);
      return;
    }

    // 🔥 필터 로직 (여기 핵심)
    const filtered = friends.filter((f) =>
      f.name.toLowerCase().startsWith(mentionCandidate.toLowerCase()),
    );

    setFilteredFriends(filtered);
    setIsMentionOpen(filtered.length > 0);
    if (filtered.length > 0) setSelected(channels[1]);
  };

  // 필터 버튼 스타일 맵
  const filterStyles = {
    전체: 'bg-black',
    대기: 'bg-[#2ADB75]',
    개인: 'bg-[#FFB83E]',
    팀: 'bg-[#73ABFF]',
  } as const;

  const filters = ['전체', '대기', '개인', '팀'] as const;

  const handleMentionSelect = (friend: Friend) => {
    console.log('선택:', friend);
    setIsMentionOpen(false);

    // 멘션만 남기고 전체 교체
    setInput(`@${friend.name} `);

    // 친구 채널로 전환
    setSelected(channels[1]);

    // 첫 친구로 highlight 초기화
    setHighlightIndex(0);
  };

  const sendMessage = () => {
    const trimmed = input.trim();

    const onlyMention = /^@\S+$/.test(trimmed);
    if (trimmed === '' || onlyMention) return;

    const targetName = extractValidMention(input);

    // 친구 채널인데 멘션이 유효하지 않으면 일반 메세지로 전환
    const isValidFriendMsg = selected.value === '친구' && targetName;

    // 친구 메시지면 멘션 제거
    const cleanText = isValidFriendMsg
      ? input.replace(`@${targetName}`, '').trim()
      : input;

    setMessages((prev) => [
      ...prev,
      {
        channel: isValidFriendMsg ? '친구' : '전체',
        text: cleanText,
        targetNickname: isValidFriendMsg ? targetName : undefined,
      },
    ]);

    setInput('');
    setSelected(channels[0]);
    setIsMentionOpen(false);
    setHighlightIndex(0);
  };

  const extractValidMention = (text: string) => {
    const match = text.match(/@([\p{Script=Hangul}a-zA-Z0-9_]+)/u);
    return match ? match[1] : null;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // 검색 + 필터 적용된 방 리스트 출력
  const filteredRooms = rooms.filter((room) => {
    // 필터 조건
    const filterMatch =
      roomFilter === '전체' ||
      (roomFilter === '대기' && room.status === '대기중') ||
      room.status === roomFilter ||
      room.mode === roomFilter;

    // 검색어 조건: commitSearch 기준
    const search = commitSearch.trim().toLowerCase();
    const searchMatch =
      !search || // 검색어 없으면 모두 통과
      room.title.toLowerCase().includes(search) ||
      room.id.toString().includes(search);

    return filterMatch && searchMatch;
  });

  return (
    <div className="flex items-center justify-center min-w-[1500px] mx-auto min-h-screen gap-x-10 font-ssrm font-bold">
      <div className="flex flex-col px-8 py-10 items-center w-[380px] h-[760px] rounded-3xl bg-[#1E3411]/40 text-white">
        <div className="flex self-start items-center gap-x-1 text-yellow-300">
          <CircleStackIcon className="w-7 h-7" />
          <span className="text-2xl">50</span>
        </div>

        <div className="w-[225px] h-[225px] rounded-full shadow-lg border-2 border-white bg-white/30" />

        <div className="flex flex-col w-full mt-6">
          <div className="flex items-end justify-between">
            <div className="flex items-center mb-1">
              <div className="w-[35px] h-[35px] ml-2 rounded-full bg-gray-400 border border-white flex items-center justify-center">
                <span className="text-white text-2xl">{currentLv}</span>
              </div>
              <span className="ml-2 text-3xl text-white">{nickname}</span>
              <Cog8ToothIcon className="w-8 h-8 text-white ml-1 cursor-pointer" />
            </div>
            <span className="text-xs">
              {currentXp}/{maxXp}
            </span>
          </div>

          <div className="mt-1 w-full">
            <div className="w-full h-5 rounded-full border border-white/80 p-[2px] overflow-hidden">
              <div
                className="h-full bg-[#3AE7A2] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full mt-4 gap-3 text-3xl">
          <button className="w-full h-[72px] rounded-full bg-[#6EE035] text-white hover:opacity-90 transition">
            마이페이지
          </button>
          <button className="w-full h-[72px] rounded-full bg-[#5697FF] text-white hover:opacity-90 transition">
            상점
          </button>

          <div className="flex justify-between gap-3">
            <button className="flex-1 h-[72px] rounded-full bg-[#FF5353] text-white hover:opacity-90 transition">
              랭킹
            </button>
            <button className="flex-1 h-[72px] rounded-full bg-[#FFBD2F] text-white hover:opacity-90 transition">
              친구
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full h-[72px] rounded-full bg-black text-white hover:opacity-90 transition"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="w-[1100px] h-[760px] px-10 py-10 rounded-3xl bg-[#1E3411]/40">
        {/* 상단 */}
        <div className="flex mt-[6px]">
          {/* 검색창 */}
          <div className="flex w-[480px]">
            <input
              className="w-full border-none outline-none px-4 rounded-l-xl bg-white font-ssrn font-normal text-[20px] placeholder-gray-300"
              placeholder="방 번호나 제목으로 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              className="px-3 py-[10px] bg-gray-300 hover:opacity-90 transition rounded-r-xl"
              onClick={handleSearch}
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </div>
          {/* 카테고리 */}
          <div className="flex ml-5 p-1 gap-x-1 w-[305px] bg-white/20 rounded-xl">
            {filters.map((filter) => {
              const isAll = roomFilter === '전체';
              const isActive = roomFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setRoomFilter(filter)}
                  className={`px-4 rounded-lg text-white text-2xl font-bold 
                    ${
                      isAll
                        ? filterStyles[filter] // 전체 → 모든 버튼 색 유지
                        : isActive
                          ? filterStyles[filter] // 해당 버튼만 원래 색
                          : 'bg-[#464646]' // 나머지 회색
                    }
                  `}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* 알림 */}
          <div className="flex items-center mx-5">
            <button>
              <BellIcon className="w-8 h-8 text-white cursor-pointer" />
            </button>
          </div>
          {/* 방만들기 버튼 */}
          <div className="flex ml-1 p-1 rounded-xl bg-white/20">
            <button
              onClick={() => setIsCreateRoomModalOpen(true)}
              className="px-5 rounded-lg bg-black text-white text-2xl"
            >
              방만들기
            </button>
          </div>
        </div>
        {/* 중단, 스크롤바 */}
        <div
          className="
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
          <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-3xl">
            {filteredRooms.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-44">
                <span className="text-white text-3xl font-bold drop-shadow">
                  현재 활성화된 방이 없어요!
                </span>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="w-[480px] h-[120px] rounded-2xl bg-white p-4"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center px-3 py-1 rounded-xl ${
                        room.status === '게임중'
                          ? 'bg-[#FE543E]'
                          : 'bg-[#2ADB75]'
                      }`}
                    >
                      <span className="text-xl text-white">{room.id}</span>
                    </div>

                    <p className="ml-2 text-black text-3xl font-bold flex items-center gap-2">
                      {room.title}
                      {room.isLocked && (
                        <LockClosedIcon className="w-5 h-5 text-gray-600 inline-block" />
                      )}
                    </p>

                    <button className="ml-auto">
                      <EllipsisVerticalIcon className="w-8 h-8 text-black cursor-pointer" />
                    </button>
                  </div>

                  <div className="flex justify-end items-center gap-x-3 mt-6 pr-2">
                    <div
                      className={`
                      px-3 rounded-xl text-white text-lg font-bold
                      ${room.mode === '팀' ? 'bg-[#73ABFF]' : 'bg-[#FFB83E]'}
                    `}
                    >
                      {room.mode}
                    </div>

                    <span
                      className={`text-xl font-normal ${
                        room.status === '대기중'
                          ? 'text-[#2ADB75]'
                          : 'text-[#FE543E]'
                      }`}
                    >
                      {room.status}
                    </span>

                    <span className="text-black text-lg font-semibold">
                      {room.current} / {room.max}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* 하단 채팅창 */}
        <div className="relative mt-5 w-[1020px] h-[190px] rounded-b-2xl bg-white/70 border border-[#c0c8b0] shadow-sm p-4 flex flex-col justify-between">
          {/* 메시지 로그 */}
          <div
            ref={messagesEndRef}
            className="flex h-[120px] flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D3D3D3] scrollbar-track-transparent pr-2 text-sm leading-tight"
          >
            {messages.length === 0 ? (
              <p className="text-[20px] text-gray-400 italic">
                아직 메시지가 없습니다.
              </p>
            ) : (
              messages.map((msg, i) => {
                const isFriend = msg.channel === '친구';
                return (
                  <p
                    key={i}
                    className={`
            text-base leading-tight px-1 rounded-md
            ${isFriend ? 'text-[#305946] font-bold' : 'text-black'}
          `}
                  >
                    {isFriend ? (
                      <>
                        <span className="text-[20px]">
                          [친구] {msg.targetNickname}에게 :
                        </span>{' '}
                        <span className="text-[20px]">{msg.text}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-[20px] mr-1">
                          [전체]
                        </span>
                        <span className="text-[20px]">당신 : </span>
                        <span className="text-[20px]">{msg.text}</span>
                      </>
                    )}
                  </p>
                );
              })
            )}
          </div>

          {/* 입력창 */}
          <div className="flex mt-2 border-2 border-black rounded-xl overflow-hidden bg-white h-[50px]">
            {/* 채널 선택 영역 */}
            <div
              className="flex items-center bg-white rounded-l-xl pl-2 pr-0 h-full cursor-pointer select-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* 채널 이름 */}
              <span
                className={`
                text-[30px] font-bold pr-2
                ${selected.value === '친구' ? 'text-[#305946]' : 'text-gray-800'}
              `}
              >
                {selected.label}
              </span>

              {/* 화살표 버튼 */}
              <span
                className={`
                w-10 h-full flex items-center justify-center text-xl 
                transition-all duration-150
                border-l border-r border-[#305946]
                ${isOpen ? 'bg-white text-[#305946]' : 'bg-[#305946] text-white'}
              `}
              >
                {isOpen ? '▲' : '▼'}
              </span>
            </div>

            {/* 입력 필드 */}
            <input
              value={input}
              onChange={handleMentionOpen}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              className="flex-1 px-3 text-lg outline-none h-full"
            />

            {isMentionOpen && (
              <MentionDropdown
                friends={filteredFriends}
                onSelect={handleMentionSelect}
                highlightIndex={highlightIndex}
              />
            )}

            {/* 전송 버튼 */}
            <button
              onClick={sendMessage}
              disabled={input.trim() === ''}
              className={`
              w-8 h-8 flex items-center justify-center
              rounded-full text-white transition self-center mr-2
              ${
                input.trim() === '' ||
                /^@[a-zA-Z0-9가-힣_]+$/.test(input.trim())
                  ? 'bg-[#2a7140]/70 cursor-not-allowed'
                  : 'bg-[#2a7140] hover:bg-[#1d6133] cursor-pointer'
              }
            `}
            >
              <ArrowUpIcon className="w-5 h-5 text-bold" />
            </button>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
              <div className="absolute mt-[48px] w-[140px] bg-white border border-black rounded-xl shadow-lg z-50 overflow-hidden">
                {channels.map((ch) => (
                  <div
                    key={ch.value}
                    onClick={() => {
                      setSelected(ch);
                      setIsOpen(false);

                      // ✅ 친구 선택 시 자동으로 '@' 입력
                      if (ch.value === '친구') {
                        // 이미 @로 메시지 시작 중이면 중복 입력 안함
                        if (!input.startsWith('@')) {
                          setInput('@');
                          setIsMentionOpen(true);
                          setFilteredFriends(friends);
                          setHighlightIndex(0);
                        }
                      }
                    }}
                    className={`px-3 py-2 text-[24px] cursor-pointer hover:bg-gray-200 ${
                      ch.value === '친구'
                        ? 'text-[#305946] font-bold'
                        : 'text-black'
                    }`}
                  >
                    {ch.label}
                    {ch.value === '친구' && (
                      <UserIcon className="w-7 h-7 inline-block ml-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isCreateRoomModalOpen && (
        <CreateRoomModal onClose={() => setIsCreateRoomModalOpen(false)} />
      )}
    </div>
  );
};

export default LobbyPage;
