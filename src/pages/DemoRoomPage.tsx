import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LockClosedIcon } from '@heroicons/react/24/outline';

import { useAuthStore } from '@/entities/user';
import {
  DEMO_GUEST_ROOM_ID,
  DEMO_HOST_ROOM_ID,
} from '@/entities/room/api/mockRooms';
import { getPortfolioUser } from '@/entities/user/model/portfolioUser';
import type { Outfit, Player, WaitingStatus } from '@/shared/model';
import { CreateRoomModal } from '@/features/main';
import { useCreateRoomModalStore } from '@/features/main';
import { RoomActionButtons, RoomDashboard, TeamSection } from '@/features/lobby';
import {
  usePortfolioOutfitForPlayer,
} from '@/features/shop/model/portfolioShopStorage';

const makePlayer = ({
  userId,
  nickname,
  level,
  outfit,
  isReady,
  status = 'IDLE',
  totalScore,
}: {
  userId: string;
  nickname: string;
  level: number;
  outfit: Outfit;
  isReady: boolean;
  status?: WaitingStatus;
  totalScore: number;
}): Player => ({
  userId,
  nickname,
  level,
  exp: 0,
  coins: 0,
  outfit,
  status,
  teamId: 'BLUE',
  isConnected: true,
  isReady,
  totalScore,
  inventory: [],
});

const createBaseOutfit = (bird: string): Outfit => ({
  bird,
  accessory: null,
  hat: null,
  top: null,
  bottom: null,
  shoes: null,
  effect: null,
});

const DemoRoomPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const user = getPortfolioUser(useAuthStore((state) => state.user));
  const openRoomSettingsModal = useCreateRoomModalStore((state) => state.open);
  const portfolioOutfit = usePortfolioOutfitForPlayer(
    user.outfit?.bird ?? 'bird_07',
  );
  const [isReady, setIsReady] = useState(false);
  const [myStatus, setMyStatus] = useState<WaitingStatus>('IDLE');

  const numericRoomId = Number(roomId);
  const isHostRoom = numericRoomId === DEMO_HOST_ROOM_ID;
  const isGuestRoom = numericRoomId === DEMO_GUEST_ROOM_ID;
  const isLockedDemo = !isHostRoom && !isGuestRoom;

  const { players, me, hostId } = useMemo(() => {
    const mePlayer = makePlayer({
      userId: String(user.id),
      nickname: `${user.nickname}#${user.tag}`,
      level: user.level ?? 7,
      outfit:
        import.meta.env.VITE_USE_MOCK === 'true'
          ? portfolioOutfit
          : createBaseOutfit(user.outfit?.bird ?? 'bird_07'),
      isReady: isHostRoom || isReady,
      status: myStatus,
      totalScore: 920,
    });

    const readyGuest = makePlayer({
      userId: 'demo-guest-1',
      nickname: '그림고수#1212',
      level: 11,
      outfit: createBaseOutfit('bird_03'),
      isReady: true,
      totalScore: 850,
    });

    const idleGuest = makePlayer({
      userId: 'demo-guest-2',
      nickname: '색칠장인#3434',
      level: 9,
      outfit: createBaseOutfit('bird_04'),
      isReady: false,
      totalScore: 780,
    });

    if (isHostRoom) {
      return {
        players: [mePlayer, readyGuest],
        me: mePlayer,
        hostId: mePlayer.userId,
      };
    }

    return {
      players: [readyGuest, mePlayer, idleGuest],
      me: mePlayer,
      hostId: readyGuest.userId,
    };
  }, [isHostRoom, isReady, myStatus, portfolioOutfit, user]);

  const canStartGame =
    isHostRoom &&
    players
      .filter((player) => String(player.userId) !== String(hostId))
      .every((player) => player.isReady);

  const handleMainAction = () => {
    if (isHostRoom) {
      if (canStartGame) navigate(`/demo/game/${DEMO_HOST_ROOM_ID}`);
      return;
    }

    setIsReady((prev) => !prev);
  };

  const handleLeave = () => {
    navigate('/');
  };

  const handleUpdateStatus = (status: WaitingStatus) => {
    setMyStatus(status);
  };

  const handleOpenSettings = () => {
    openRoomSettingsModal('EDIT', {
      name: isHostRoom ? '당신이 방장!' : '당신은 손님!',
      mode: 'SOLO',
      maxPlayers: 6,
      isPrivate: false,
      password: '',
    });
  };

  if (isLockedDemo) {
    return (
      <div className="flex h-screen min-w-[1500px] items-center justify-center font-ssrm font-bold">
        <div className="flex w-[720px] flex-col items-center rounded-3xl bg-[#1E3411]/50 p-14 text-white">
          <LockClosedIcon className="mb-6 h-20 w-20" />
          <h1 className="text-5xl">잠금방입니다</h1>
          <p className="mt-5 text-2xl text-white/80">
            포트폴리오 데모에서는 열린 방 2개만 입장할 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-10 rounded-2xl bg-white px-10 py-4 text-2xl text-[#1E3411]"
          >
            메인으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-w-[1500px] mx-auto h-screen overflow-hidden gap-x-10 font-ssrm font-bold">
      <div className="flex justify-between w-[1450px] h-[760px] px-8 py-10 rounded-3xl bg-[#1E3411]/40">
        <div className="relative w-[840px] flex flex-col">
          <div className="w-full h-full rounded-3xl bg-gray-300/40 flex flex-col overflow-hidden">
            <TeamSection
              gradient="from-transparent to-transparent"
              players={players.slice(0, 3)}
              hostId={hostId}
              amIHost={isHostRoom}
              myUserId={me.userId}
              onKick={() => undefined}
              onNudge={() => undefined}
            />
            <TeamSection
              gradient="from-transparent to-transparent"
              players={players.slice(3, 6)}
              hostId={hostId}
              amIHost={isHostRoom}
              myUserId={me.userId}
              onKick={() => undefined}
              onNudge={() => undefined}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between w-[560px] p-5 rounded-3xl">
          <RoomDashboard
            onOpenSettings={isHostRoom ? handleOpenSettings : undefined}
            onUpdateStatus={handleUpdateStatus}
          />

          <RoomActionButtons
            amIHost={isHostRoom}
            canStartGame={canStartGame}
            isReady={isReady}
            onMainAction={handleMainAction}
            onLeave={handleLeave}
          />
        </div>
      </div>

      <CreateRoomModal noopOnSubmit />
    </div>
  );
};

export default DemoRoomPage;
