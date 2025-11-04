import { useEffect, useRef } from 'react';

// UI 제작을 위한 임시 타입으로, 이후 분리 예정입니다.
interface Friend {
  id: number;
  name: string;
}

interface MentionDropdownProps {
  friends: Friend[];
  onSelect: (friend: Friend) => void;
  highlightIndex: number;
}

export const MentionDropdown = ({
  friends,
  onSelect,
  highlightIndex,
}: MentionDropdownProps) => {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const element = itemRefs.current[highlightIndex];
    if (element) {
      element.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [highlightIndex]);

  return (
    <div
      className="
          absolute top-[175px] left-[160px]
          w-[200px] bg-white border border-gray-300 rounded-lg 
          shadow-lg max-h-[125px] overflow-y-auto z-50
        "
    >
      {friends.map((friend, idx) => (
        <div
          key={friend.id}
          ref={(el: HTMLDivElement | null): void => {
            itemRefs.current[idx] = el;
          }}
          onClick={() => onSelect(friend)}
          className={`
              px-3 py-2 cursor-pointer text-[16px] flex items-center gap-2
              ${highlightIndex === idx ? 'bg-gray-200' : 'hover:bg-gray-100'}
            `}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>{friend.name}</span>
        </div>
      ))}
    </div>
  );
};
