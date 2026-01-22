import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  FriendAction,
  FriendProfile,
  FriendRelation,
} from '@/entities/friend';
import { useSocket, SOCKET_EVENTS } from '@/shared/api/socket';

interface Friend extends FriendProfile {
  relation: FriendRelation;
}

const RELATION_PRIORITY: Record<FriendRelation, number> = {
  REQUEST_RECEIVED: 1,
  REQUEST_SENT: 2,
  FRIEND: 3,
  BLOCKED: 5,
};

export const useFriend = (searchKeyword: string = '') => {
  const { socket } = useSocket();

  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recommendedFriends, setRecommendedFriends] = useState<FriendProfile[]>(
    [],
  );
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);

  // 소켓 리스너 설정
  useEffect(() => {
    if (!socket) return;

    const handleListResponse = (data: Friend[]) => {
      setFriends(data);
      setIsLoading(false);
    };

    const handleRecommendedResponse = (data: FriendProfile[]) => {
      setRecommendedFriends(data);
    };

    const handleSearchResponse = (data: FriendProfile[]) => {
      setSearchResults(data);
    };

    const handleStatusUpdate = ({
      userId,
      relation,
    }: {
      userId: number | string;
      relation: FriendRelation | 'NONE';
    }) => {
      setFriends((prev) => {
        if (relation === 'NONE') {
          return prev.filter((f) => f.userId !== userId);
        }
        // 기존 목록에 없던 유저(새 친구 등)가 들어올 수도 있으니 체크 필요
        const exists = prev.find((f) => f.userId === userId);
        if (!exists && relation === 'FRIEND') {
          // 실제 앱에선 프로필 정보가 필요하므로 새로고침하거나 서버가 전체 객체를 줘야 함.
          // 임시로 새로고침 요청
          socket.emit(SOCKET_EVENTS.FRIEND_GET_ALL);
          return prev;
        }

        return prev.map((f) =>
          f.userId === userId
            ? { ...f, relation: relation as FriendRelation }
            : f,
        );
      });
    };

    // 이벤트 구독
    socket.on(SOCKET_EVENTS.FRIEND_GET_ALL_RESPONSE, handleListResponse);
    socket.on(SOCKET_EVENTS.FRIEND_STATUS_UPDATE, handleStatusUpdate);
    socket.on(
      SOCKET_EVENTS.FRIEND_GET_RECOMMENDED_RESPONSE,
      handleRecommendedResponse,
    );
    socket.on(SOCKET_EVENTS.FRIEND_SEARCH_RESPONSE, handleSearchResponse);

    // 초기 데이터 요청
    socket.emit(SOCKET_EVENTS.FRIEND_GET_ALL);
    socket.emit(SOCKET_EVENTS.FRIEND_GET_RECOMMENDED);

    return () => {
      socket.off(SOCKET_EVENTS.FRIEND_GET_ALL_RESPONSE, handleListResponse);
      socket.off(SOCKET_EVENTS.FRIEND_STATUS_UPDATE, handleStatusUpdate);
      socket.off(
        SOCKET_EVENTS.FRIEND_GET_RECOMMENDED_RESPONSE,
        handleRecommendedResponse,
      );
      socket.off(SOCKET_EVENTS.FRIEND_SEARCH_RESPONSE, handleSearchResponse);
    };
  }, [socket]);

  // 액션 핸들러들
  const handleFriendAction = useCallback(
    (targetId: number | string, action: FriendAction) => {
      if (!socket) return;
      switch (action) {
        case 'ACCEPT':
          socket.emit(SOCKET_EVENTS.FRIEND_ACCEPT, { requesterId: targetId });
          break;
        case 'BLOCK':
          socket.emit(SOCKET_EVENTS.FRIEND_BLOCK, { targetId });
          break;
        case 'CANCEL':
        case 'REJECT':
        case 'DELETE':
        case 'UNBLOCK':
          socket.emit(SOCKET_EVENTS.FRIEND_DELETE, { targetId });
          break;
        default:
          console.warn('Unknown Friend Action:', action);
      }
    },
    [socket],
  );

  const requestFriend = useCallback(
    (targetNickname: string) => {
      if (!socket) return;
      socket.emit(SOCKET_EVENTS.FRIEND_REQUEST_SEND, { targetNickname });
    },
    [socket],
  );

  const refreshRecommended = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.FRIEND_GET_RECOMMENDED);
  }, [socket]);

  const searchUsers = useCallback(
    (keyword: string) => {
      if (!socket) return;
      if (!keyword.trim()) {
        setSearchResults([]);
        return;
      }
      socket.emit(SOCKET_EVENTS.FRIEND_SEARCH, { keyword });
    },
    [socket],
  );

  // 필터링 및 정렬 로직 (메모이제이션)
  const processedFriends = useMemo(() => {
    const filtered = friends.filter((friend) =>
      friend.nickname.toLowerCase().includes(searchKeyword.toLowerCase()),
    );

    return [...filtered].sort((a, b) => {
      const getPriority = (friend: Friend) => {
        if (friend.relation === 'FRIEND') return friend.isOnline ? 3 : 4;
        return RELATION_PRIORITY[friend.relation] ?? 99;
      };
      const priorityDiff = getPriority(a) - getPriority(b);
      return priorityDiff !== 0
        ? priorityDiff
        : a.nickname.localeCompare(b.nickname);
    });
  }, [searchKeyword, friends]);

  return {
    processedFriends,
    searchResults,
    recommendedFriends,
    handleFriendAction,
    requestFriend,
    searchUsers,
    refreshRecommended,
    isLoading,
  };
};
