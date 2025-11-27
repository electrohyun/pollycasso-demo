import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getSocket } from '@/shared/api/socket';
import type { RoomState } from '@/entities/game/model/types';

const MY_USER_ID = 'id-1234'; // 임시 ID

export const useRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
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

  const topGradient = isSolo
    ? 'from-transparent to-transparent'
    : isMyTeamBlue
      ? 'from-[#0088FF] to-[#005299]'
      : 'from-[#FF553F] to-[#993326]';

  const bottomGradient = isSolo
    ? 'from-transparent to-transparent'
    : isMyTeamBlue
      ? 'from-[#FF553F] to-[#993326]'
      : 'from-[#0088FF] to-[#005299]';

  const topTeamId = isMyTeamBlue ? 'BLUE' : 'RED';
  const bottomTeamId = !isMyTeamBlue ? 'BLUE' : 'RED';

  const handleMainAction = () => {
    if (amIHost) {
      if (canStartGame) {
        getSocket().emit('startGame', { roomId });
      } else {
        alert('모든 플레이어가 준비해야 시작할 수 있습니다!');
      }
    } else {
      if (!me) return;
      getSocket().emit('toggleReady', { userId: MY_USER_ID });
    }
  };

  const handleLeave = () => {
    if (window.confirm('정말 방을 나가시겠습니까?')) {
      getSocket().emit('leaveRoom', { userId: MY_USER_ID });
      navigate('/');
    }
  };

  const handleChangeTeam = (targetTeam: 'BLUE' | 'RED') => {
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

  const handleKick = (targetId: string, nickname: string) => {
    if (window.confirm(`정말 '${nickname}'님을 강퇴하시겠습니까?`)) {
      getSocket().emit('kickUser', { targetId });
    }
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
      topGradient,
      bottomGradient,
      topTeamId,
      bottomTeamId,
    },
    actions: {
      handleMainAction,
      handleLeave,
      handleChangeTeam,
      handleKick,
    },
    constants: {
      MY_USER_ID,
    },
  };
};
