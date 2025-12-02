import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getSocket } from '@/shared/api/socket';
import type { RoomState } from '@/entities/game/model/types';

const MY_USER_ID = 'id-1234'; // 임시 ID

export const useRoom = () => {
  const { roomId } = useParams();
  const [roomState, setRoomState] = useState<RoomState | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('joinRoom', { roomId });

    socket.on('gameState', (newState: RoomState) => {
      setRoomState(newState);
    });
    return () => {
      socket.off('gameState');
    };
  }, [roomId]);

  const me = roomState?.players.find((p) => p.userId === MY_USER_ID);
  const myTeamId = me?.teamId || 'BLUE';
  const isMyTeamBlue = myTeamId === 'BLUE';
  const isSolo = roomState?.settings?.gameMode === 'SOLO';
  const amIHost = roomState?.hostId === MY_USER_ID;

  const bluePlayers =
    roomState?.players.filter((p) => p.teamId === 'BLUE') || [];
  const redPlayers = roomState?.players.filter((p) => p.teamId === 'RED') || [];

  const topTeamPlayers = isMyTeamBlue ? [...bluePlayers] : [...redPlayers];
  const bottomTeamPlayers = isMyTeamBlue ? [...redPlayers] : [...bluePlayers];

  // 내 팀(Top)일 경우 나를 맨 앞으로 정렬
  if (me) {
    topTeamPlayers.sort((a, _) => (a.userId === me.userId ? -1 : 1));
  }

  const otherPlayers =
    roomState?.players.filter((p) => p.userId !== roomState?.hostId) || [];
  const canStartGame =
    otherPlayers.length > 0 && otherPlayers.every((p) => p.isReady);

  const topTeamId = isMyTeamBlue ? 'BLUE' : 'RED';
  const bottomTeamId = !isMyTeamBlue ? 'BLUE' : 'RED';

  const startGame = () => {
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
