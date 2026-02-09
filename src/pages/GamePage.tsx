import { useEffect, useState } from 'react';

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
  const { gameSocket } = useGameSocket();
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('WAITING');

  useEffect(() => {
    if (!gameSocket) return;

    const syncStatus = (payload: Pick<RoomState, 'status'>) => {
      if (!payload?.status) return;

      setRoomStatus(payload.status);
    };

    gameSocket.on('room:joinSuccess', syncStatus);
    gameSocket.on('room:stateSync', syncStatus);

    return () => {
      gameSocket.off('room:joinSuccess', syncStatus);
      gameSocket.off('room:stateSync', syncStatus);
    };
  }, [gameSocket]);

  let widget = <LoadingWidget duration={2} />;

  if (roomStatus === 'WAITING') widget = <RoomWidget />;
  else if (roomStatus === 'LOADING') widget = <LoadingWidget />;
  else if (GAME_PHASE_STATUSES.includes(roomStatus)) widget = <GameWidget />;

  return widget;
};

export default GamePage;
