interface RoomFilterTabsProps {
  currentFilter: '전체' | '대기' | '개인' | '팀';
  onChange: (filter: '전체' | '대기' | '개인' | '팀') => void;
}

const filterStyles = {
  전체: 'bg-[#464646]',
  대기: 'bg-[#2ADB75]',
  개인: 'bg-[#FFB83E]',
  팀: 'bg-[#73ABFF]',
} as const;

const filters = ['전체', '대기', '개인', '팀'] as const;

export default function RoomFilterTabs({
  currentFilter,
  onChange,
}: RoomFilterTabsProps) {
  return (
    <div className="flex ml-5 p-1 gap-x-1 w-[305px] bg-white/20 rounded-xl">
      {filters.map((filter) => {
        const isAll = currentFilter === '전체';
        const isActive = currentFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`px-4 rounded-lg text-white text-2xl font-bold 
                ${
                  isAll
                    ? filterStyles[filter]
                    : isActive
                      ? filterStyles[filter]
                      : 'bg-[#464646]'
                }
              `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
