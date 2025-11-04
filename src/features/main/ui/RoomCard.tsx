import {
  EllipsisVerticalIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import type { Room } from '@/features/main/model/types';

interface RoomCardProps {
  room: Room;
  onEnterRoom?: (roomId: number) => void;
  onOpenMenu?: (roomId: number) => void;
}

const STATUS_LABEL = {
  WAITING: '대기중',
  IN_PROGRESS: '게임중',
} as const;

const STATUS_TEXT_COLOR = {
  WAITING: 'text-[#2ADB75]',
  IN_PROGRESS: 'text-[#FE543E]',
} as const;

const STATUS_BG_COLOR = {
  WAITING: 'bg-[#2ADB75]',
  IN_PROGRESS: 'bg-[#FE543E]',
} as const;

const MODE_LABEL = {
  TEAM: '팀',
  SOLO: '개인',
} as const;

const MODE_BG_COLOR = {
  TEAM: 'bg-[#73ABFF]',
  SOLO: 'bg-[#FFB83E]',
} as const;

export default function RoomCard({
  room,
  onEnterRoom,
  onOpenMenu,
}: RoomCardProps) {
  return (
    <div
      className="w-[480px] h-[120px] rounded-2xl bg-white p-4 cursor-pointer hover:scale-[1.02] transition"
      onClick={() => onEnterRoom?.(room.id)}
    >
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center px-3 py-1 rounded-xl ${
            STATUS_BG_COLOR[room.status]
          }`}
        >
          <span className="text-xl text-white">{room.id}</span>
        </div>

        <p className="ml-2 text-black text-3xl font-bold flex items-center gap-2">
          {room.name}
          {room.isPrivate && (
            <LockClosedIcon className="w-5 h-5 text-gray-600 inline-block" />
          )}
        </p>

        <button
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu?.(room.id);
          }}
        >
          <EllipsisVerticalIcon className="w-8 h-8 text-black cursor-pointer" />
        </button>
      </div>

      <div className="flex justify-end items-center gap-x-3 mt-6 pr-2">
        <div
          className={`
            px-3 rounded-xl text-white text-lg font-bold
            ${MODE_BG_COLOR[room.mode]}
          `}
        >
          {MODE_LABEL[room.mode]}
        </div>

        <span
          className={`text-xl font-normal ${STATUS_TEXT_COLOR[room.status]}`}
        >
          {STATUS_LABEL[room.status]}
        </span>

        <span className="text-black text-lg font-semibold">
          {room.currentPlayers} / {room.maxPlayers}
        </span>
      </div>
    </div>
  );
}
