import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { io, Socket } from 'socket.io-client';

import type { RoomState, Player } from '@/shared/model';
import { useAuthStore } from '@/entities/user';
import {
  selectCanStartGame,
  selectMe,
  selectTopBottomTeams,
} from './roomSelectors';

export const useRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user, accessToken } = useAuthStore();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);

  const myUserId = user?.id;

  useEffect(() => {
    if (!roomId || !accessToken) return;

    const socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/waiting`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    setSocket(socketInstance);

    socketInstance.on('room:joinSuccess', (initialState: RoomState) => {
      setRoomState(initialState);
    });

    // 플레이어 목록만 갱신
    socketInstance.on(
      'room:syncPlayerList',
      ({ players }: { players: Player[] }) => {
        setRoomState((prev) => (prev ? { ...prev, players } : null));
      },
    );

    // 방 설정 변경 (제목, 모드 등)
    socketInstance.on(
      'room:updateRoom',
      ({ roomSettings }: { roomSettings: any }) => {
        setRoomState((prev) =>
          prev ? { ...prev, settings: roomSettings } : null,
        );
      },
    );

    socketInstance.on(
      'room:updatePlayer',
      ({ userId, changes }: { userId: string; changes: any }) => {
        setRoomState((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            players: prev.players.map((p) =>
              String(p.userId) === String(userId) ? { ...p, ...changes } : p,
            ),
          };
        });
      },
    );

    // 3. 방 입장 요청
    socketInstance.emit('room:join', { roomId: Number(roomId) });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId, accessToken]);

  const me = selectMe(roomState, myUserId ?? '');
  const isSolo = roomState?.settings?.gameMode === 'SOLO';
  const amIHost = String(roomState?.hostId) === String(myUserId);

  const { topTeamId, bottomTeamId, topTeamPlayers, bottomTeamPlayers } =
    selectTopBottomTeams(roomState, myUserId ?? '');

  const canStartGame = selectCanStartGame(roomState);

  // 게임 시작 (이벤트명 변경됨)
  const startGame = () => {
    if (!socket) return;
    socket.emit('game:startRequest');
  };

  // 준비 토글 (페이로드 불필요)
  const toggleReady = () => {
    if (!socket) return;
    socket.emit('room:readyToggle');
  };

  // 팀 변경 (targetTeam)
  const changeTeam = (targetTeam: 'BLUE' | 'RED' | 'NONE') => {
    if (!socket || !me || me.team === targetTeam) return;
    socket.emit('room:changeTeam', { targetTeam });
  };

  // 강퇴 (ID 타입 숫자 변환)
  const kickUser = (targetUserId: string | number) => {
    if (!socket) return;
    socket.emit('room:kickUser', { targetUserId: Number(targetUserId) });
  };

  const leaveRoom = () => {
    if (!socket) return;
    socket.emit('room:leave');
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
      myUserId,
    },
  };
};
