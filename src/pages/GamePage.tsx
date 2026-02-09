import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useGameSocket } from '@/shared/api/socket/GameSocketProvider';
import type { RoomState, RoomStatus } from '@/shared/model';
import { GameWidget } from '@/widgets/game';
import { LoadingWidget } from '@/widgets/loading';
import { RoomWidget } from '@/widgets/waiting';

const GAME_PHASE_STATUSES: RoomStatus[] = [
  'THEME_SELECTING',
  'DRAWING',
  'EVALUATING',
  'ROUND_SUMMARY',
  'FINISHED',
];

const GamePage = () => {
  const navigate = useNavigate();
  const { gameSocket } = useGameSocket();
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('WAITING');
  const [loadingEndsAt, setLoadingEndsAt] = useState<number | null>(null);

  useEffect(() => {
    if (!gameSocket) return;

    type UpdateGameStatePayload = {
      phase: RoomStatus;
      endsAt: number | null;
    };

    const syncStatus = (payload: Pick<RoomState, 'status' | 'endsAt'>) => {
      if (!payload?.status) return;
      const nextStatus = payload.status;
      const nextEndsAt = payload.endsAt ?? null;
      if (nextStatus === 'LOADING') {
        setLoadingEndsAt(nextEndsAt);
      } else {
        setLoadingEndsAt(null);
      }
      setRoomStatus(payload.status);
    };

    const syncPhase = (payload: UpdateGameStatePayload) => {
      if (!payload?.phase) return;
      if (payload.phase === 'LOADING') {
        setLoadingEndsAt(payload.endsAt ?? null);
      } else {
        setLoadingEndsAt(null);
      }
      setRoomStatus(payload.phase);
    };

    gameSocket.on('room:joinSuccess', syncStatus);
    gameSocket.on('room:stateSync', syncStatus);
    gameSocket.on('room:updateGameState', syncPhase);

    return () => {
      gameSocket.off('room:joinSuccess', syncStatus);
      gameSocket.off('room:stateSync', syncStatus);
      gameSocket.off('room:updateGameState', syncPhase);
    };
  }, [gameSocket]);

  let widget = <LoadingWidget duration={2} endsAt={loadingEndsAt} />;

  if (roomStatus === 'WAITING') widget = <RoomWidget />;
  else if (roomStatus === 'LOADING')
    widget = <LoadingWidget endsAt={loadingEndsAt} />;
  else if (GAME_PHASE_STATUSES.includes(roomStatus)) widget = <GameWidget />;

  const handleEmergencyLeave = () => {
    gameSocket?.emit('room:leave');
    navigate('/');
  };

  return (
    <>
      <button
        type="button"
        onClick={handleEmergencyLeave}
        className="fixed top-5 right-5 z-[9999] rounded-lg border border-black bg-white px-3 py-2 text-sm font-bold text-black shadow-md"
      >
        방 나가기
      </button>
      {widget}
    </>
  );
};

export default GamePage;
