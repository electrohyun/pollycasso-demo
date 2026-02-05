import { useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  FaceSmileIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { FaceFrownIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { Title } from '@/assets';
import { RecommendedFriendCard } from '@/entities/friend/ui/RecommendedFriendCard';
import { useFriend } from '@/entities/friend';

interface AddFriendModalProps {
  onClose: () => void;
  initialRecommendedFriends: any[]; // 부모로부터 받은 데이터
}

export const AddFriendModal = ({
  onClose,
  initialRecommendedFriends,
}: AddFriendModalProps) => {
  // 훅에서 필요한 기능만 가져옴
  const { requestFriend, searchResults, searchUsers } = useFriend('');

  // 상태 관리
  const [requestedIds, setRequestedIds] = useState<Set<number>>(new Set());
  const [searchInput, setSearchInput] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  /**
   * 친구 요청 핸들러
   * 백엔드 명세에 따라 닉네임이 아닌 userId를 보냅니다.
   */
  const handleRequestFriend = (userId: number) => {
    if (requestedIds.has(userId)) return;

    // 요청 보낸 ID 목록에 추가 (UI 피드백)
    setRequestedIds((prev) => new Set(prev).add(userId));

    // 실제 소켓 이벤트 송신: { targetUserId: number }
    requestFriend(userId);
  };

  /**
   * 검색 실행 핸들러
   */
  const handleSearch = () => {
    const trimmedKeyword = searchInput.trim();
    if (!trimmedKeyword) return;

    setIsSearchMode(true);
    // 소켓 emit: friends:search { keyword: '...' }
    searchUsers(trimmedKeyword);
  };

  /**
   * 입력창 변경 핸들러
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // 입력창이 비워지면 검색 모드 해제 및 결과 초기화
    if (value.trim() === '') {
      setIsSearchMode(false);
      searchUsers('');
    }
  };

  // 현재 보여줄 리스트 결정 (검색 중이면 결과창, 아니면 추천창)
  const displayList = isSearchMode ? searchResults : initialRecommendedFriends;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 font-ssrm"
      onClick={onClose}
    >
      {/* 모달 컨테이너 */}
      <div
        className="relative bg-[#F2F2F2] w-[700px] p-6 rounded-2xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-300 rounded-md p-1 hover:bg-gray-400 transition-colors z-10"
        >
          <XMarkIcon className="w-8 h-8 text-white" />
        </button>

        {/* 로고 */}
        <img src={Title} alt="Title" className="w-[450px] my-10" />

        {/* 검색바 */}
        <div className="flex items-center my-3 w-[510px] h-12 bg-white rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition-all">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="친구의 태그(4자리)나 이름을 입력해주세요."
            autoComplete="off"
            className="flex-1 px-4 text-gray-500 text-xl outline-none placeholder:text-[#BABABA] font-light"
          />
          <button
            onClick={handleSearch}
            className="flex items-center justify-center w-16 h-full bg-[#D9D9D9] border-l border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* 리스트 영역 */}
        <div className="mt-3 w-[510px] flex flex-col font-bold">
          <div className="w-full rounded-t-2xl bg-[#153712] text-white text-xl px-4 py-1.5 font-light">
            {isSearchMode ? `'${searchInput}' 검색 결과` : '추천친구'}
          </div>

          <div className="w-full h-[350px] overflow-y-auto bg-[#E2E2E2] custom-scrollbar relative">
            {displayList && displayList.length > 0 ? (
              displayList.map((friend, index) => (
                <RecommendedFriendCard
                  key={friend.userId}
                  {...friend} // nickname, level, isOnline, outfit 등 전달
                  className={
                    index % 2 === 0 ? 'bg-[#D9D9D9]/20' : 'bg-[#D4D4D4]'
                  }
                  isRequested={requestedIds.has(friend.userId)}
                  onAdd={() => handleRequestFriend(friend.userId)}
                />
              ))
            ) : (
              /* 데이터가 없을 때의 Empty State */
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-y-3">
                {isSearchMode ? (
                  <>
                    <FaceFrownIcon className="w-16 h-16 text-gray-300" />
                    <span className="text-xl font-medium text-gray-500">
                      검색된 유저가 없어요.
                    </span>
                    <span className="text-sm text-gray-400 font-normal">
                      태그(4자리 숫자)나 이름을 다시 확인해주세요.
                    </span>
                  </>
                ) : (
                  <>
                    <FaceSmileIcon className="w-16 h-16 text-gray-300" />
                    <span className="text-xl font-medium text-gray-500">
                      모든 친구를 사귀었어요!
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 하단 데코레이션 바 */}
          <div className="mb-8 w-full rounded-b-2xl bg-[#153712] h-3" />
        </div>
      </div>
    </div>
  );
};
