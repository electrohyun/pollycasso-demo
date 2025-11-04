import { UserIcon } from '@heroicons/react/24/outline';

interface ChannelSelectProps {
  selected: { label: string; value: string };
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

export default function ChannelSelect({
  selected,
  isOpen,
  onToggle,
  onSelect,
}: ChannelSelectProps) {
  return (
    <div
      className="flex items-center bg-white rounded-l-xl pl-2 pr-0 h-full cursor-pointer select-none relative"
      onClick={onToggle}
    >
      {/* 현재 채널 */}
      <span
        className={`text-[30px] font-bold pr-2 ${
          selected.value === '친구' ? 'text-[#305946]' : 'text-gray-800'
        }`}
      >
        {selected.label}
      </span>

      {/* 화살표 */}
      <span
        className={`w-10 h-full flex items-center justify-center text-xl border-l border-r border-[#305946] ${
          isOpen ? 'bg-white text-[#305946]' : 'bg-[#305946] text-white'
        }`}
      >
        {isOpen ? '▲' : '▼'}
      </span>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute left-0 top-[50px] w-[140px] bg-white border border-black rounded-xl shadow-lg z-50 overflow-hidden">
          {/* 전체 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect('전체');
            }}
            className="px-3 py-2 text-[24px] cursor-pointer hover:bg-gray-200 text-black"
          >
            전체
          </div>

          {/* 친구 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect('친구');
            }}
            className="px-3 py-2 text-[24px] cursor-pointer hover:bg-gray-200 text-[#305946] font-bold"
          >
            친구
            <UserIcon className="w-7 h-7 inline-block ml-4" />
          </div>
        </div>
      )}
    </div>
  );
}
