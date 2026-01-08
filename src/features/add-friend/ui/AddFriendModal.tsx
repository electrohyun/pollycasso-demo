import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

import { Title } from '@/assets';
import { RecommendedFriendCard } from '@/entities/friend/ui/RecommendedFriendCard';

interface AddFriendModalProps {
  onClose: () => void;
}

const MOCK_FRIENDS = [
  { id: 1, nickname: '하하하#2103', level: 20, isOnline: true },
  { id: 2, nickname: '닉네임이엄청나게길어요#0001', level: 5, isOnline: true },
  { id: 3, nickname: '밥#8282', level: 50, isOnline: false },
  { id: 4, nickname: '테스트유저#7777', level: 12, isOnline: true },
  { id: 4, nickname: '탈주닌자#7777', level: 12, isOnline: true },
];

export const AddFriendModal = ({ onClose }: AddFriendModalProps) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50">
      <div className="relative bg-[#F2F2F2] w-[700px] p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-300 rounded-md p-1 hover:bg-gray-400 transition-colors"
        >
          <XMarkIcon className="w-8 h-8 text-white" />
        </button>

        <img src={Title} alt="Title" className="w-[450px] my-10" />

        <div className="flex items-center my-3 w-[510px] h-12 bg-white rounded-2xl overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="친구의 태그나 이름을 입력해주세요."
            className="flex-1 px-4 text-gray-500 text-xl outline-none placeholder:text-[#BABABA] font-light"
          />
          <div className="flex items-center justify-center w-16 h-full bg-[#D9D9D9] border-l border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
          </div>
        </div>

        <div className="mt-3 w-[510px] flex flex-col font-bold drop-shadow-xl">
          <div className="w-full rounded-t-2xl bg-[#153712] text-white text-xl px-4 py-1.5 font-light">
            추천친구
          </div>

          <div className="w-full h-[350px] overflow-y-auto bg-[#E2E2E2] custom-scrollbar">
            {MOCK_FRIENDS.map((friend, index) => (
              <RecommendedFriendCard
                key={friend.id}
                nickname={friend.nickname}
                level={friend.level}
                isOnline={friend.isOnline}
                className={index % 2 === 0 ? 'bg-[#E2E2E2] ' : 'bg-[#D4D4D4]'}
                onAdd={() => console.log('친구 추가:', friend.id)}
              />
            ))}
          </div>

          <div className="mb-8 w-full rounded-b-2xl bg-[#153712] h-3" />
        </div>
      </div>
    </div>
  );
};
