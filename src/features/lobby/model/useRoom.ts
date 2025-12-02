import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getSocket } from '@/shared/api/socket';
import type { RoomState } from '@/entities/game/model/types';
import {
  selectCanStartGame,
  selectMe,
  selectTopBottomTeams,
} from './roomSelectors';

const MY_USER_ID = 'id-1234'; // 임시 ID

export const useRoom = () => {
  const { roomId } = useParams();
  const [roomState, setRoomState] = useState<RoomState | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();

    const handleGameState = (newState: RoomState) => {
      setRoomState(newState);
    };

    socket.emit('joinRoom', { roomId });
    socket.on('gameState', handleGameState);

    return () => {
      socket.off('gameState', handleGameState);
    };
  }, [roomId]);

  const me = selectMe(roomState, MY_USER_ID);
  const isSolo = roomState?.settings?.gameMode === 'SOLO';
  const amIHost = roomState?.hostId === MY_USER_ID;

  const { topTeamId, bottomTeamId, topTeamPlayers, bottomTeamPlayers } =
    selectTopBottomTeams(roomState, MY_USER_ID);

  const canStartGame = selectCanStartGame(roomState);

  const startGame = () => {
    if (!roomId) return;
    getSocket().emit('startGame', { roomId });
  };

  const toggleReady = () => {
    if (!me) return;
    getSocket().emit('toggleReady', { userId: MY_USER_ID });
  };

  const leaveRoom = () => {
    getSocket().emit('leaveRoom', { userId: MY_USER_ID });
  };

  const changeTeam = (targetTeam: 'BLUE' | 'RED') => {
    if (me?.teamId === targetTeam) return;
    getSocket().emit('changeTeam', { userId: MY_USER_ID, teamId: targetTeam });

    // 낙관적 업데이트
    setRoomState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.userId === MY_USER_ID ? { ...p, teamId: targetTeam } : p,
        ),
      };
    });
  };

  const kickUser = (targetId: string) => {
    getSocket().emit('kickUser', { targetId });
  };

  return {
    roomState,
    me,
    derived: {
      isSolo,
      amIHost,
      canStartGame,
      topTeamPlayers,
      bottomTeamPlayers,
      topTeamId,
      bottomTeamId,
    },
    actions: {
      startGame,
      toggleReady,
      leaveRoom,
      changeTeam,
      kickUser,
    },
    constants: {
      MY_USER_ID,
    },
  };
};
