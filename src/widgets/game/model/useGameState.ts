import { useEffect, useMemo, useState } from 'react';

import { useAuthStore } from '@/entities/user';
import { MOCK_GAME_SELECTING } from '@/mocks/game.mock';
import type { DrawingContext, Player, RoomState } from '@/shared/model';
import { useGameSocket } from '@/shared/api/socket/GameSocketProvider';
import { SOCKET_EVENTS } from '@/shared/api/socket';

export const useGameState = () => {
  const user = useAuthStore((state) => state.user);
  const { gameSocket } = useGameSocket();

  const [roomState, setRoomState] = useState<RoomState>(MOCK_GAME_SELECTING);

  useEffect(() => {
    if (!gameSocket) return;

    const handleStateSync = (newState: RoomState) => {
      setRoomState(newState);
    };

    gameSocket.on(SOCKET_EVENTS.ROOM_STATE_SYNC, handleStateSync);

    return () => {
      gameSocket.off(SOCKET_EVENTS.ROOM_STATE_SYNC, handleStateSync);
    };
  }, [gameSocket]);

  const { status, players, endsAt, phaseContext } = roomState;

  const myData = useMemo(() => {
    if (!user) return null;
    return players.find((p: Player) => p.userId === user.id);
  }, [players, user]);

  const inventory = myData?.inventory || [];

  const currentTheme = useMemo(() => {
    if (status !== 'DRAWING') return null;

    const context = phaseContext as DrawingContext;
    return context?.currentTheme || null;
  }, [status, phaseContext]);

  return {
    status,
    players,
    endsAt,
    inventory,
    currentTheme,
  };
};
