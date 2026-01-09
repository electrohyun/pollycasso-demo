import { useCallback, useEffect, useMemo, useState } from 'react';

import type { FriendProfile, FriendRelation } from '@/entities/friend';
import { io, SOCKET_EVENTS } from '@/shared/api/socket';

type Friend = FriendProfile & { relation: FriendRelation };

export const useFriendList = (searchKeyword: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);

  const [recommendedFriends, setRecommendedFriends] = useState<FriendProfile[]>(
    [],
  );
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);

  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL), []);

  useEffect(() => {
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
        return prev.map((f) =>
          f.userId === userId
            ? { ...f, relation: relation as FriendRelation }
            : f,
        );
      });
    };

    socket.on(SOCKET_EVENTS.FRIEND_GET_ALL_RESPONSE, handleListResponse);
    socket.on(SOCKET_EVENTS.FRIEND_STATUS_UPDATE, handleStatusUpdate);
    socket.on(
      SOCKET_EVENTS.FRIEND_GET_RECOMMENDED_RESPONSE,
      handleRecommendedResponse,
    );
    socket.on(SOCKET_EVENTS.FRIEND_SEARCH_RESPONSE, handleSearchResponse);

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

  const requestFriend = useCallback(
    (targetNickname: string) => {
      socket.emit(SOCKET_EVENTS.FRIEND_REQUEST_SEND, { targetNickname });
    },
    [socket],
  );

  const refreshRecommended = useCallback(() => {
    socket.emit(SOCKET_EVENTS.FRIEND_GET_RECOMMENDED);
  }, [socket]);

  const acceptFriend = useCallback(
    (requesterId: number | string) => {
      socket.emit(SOCKET_EVENTS.FRIEND_ACCEPT, { requesterId });
    },
    [socket],
  );

  const removeFriend = useCallback(
    (targetId: number | string) => {
      socket.emit(SOCKET_EVENTS.FRIEND_DELETE, { targetId });
    },
    [socket],
  );

  const blockFriend = useCallback(
    (targetId: number | string) => {
      socket.emit(SOCKET_EVENTS.FRIEND_BLOCK, { targetId });
    },
    [socket],
  );

  const searchUsers = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) {
        setSearchResults([]);
        return;
      }
      socket.emit(SOCKET_EVENTS.FRIEND_SEARCH, { keyword });
    },
    [socket],
  );

  const processedFriends = useMemo(() => {
    const filtered = friends.filter((friend) => {
      if (!searchKeyword) return true;
      return friend.nickname
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
    });

    return filtered.sort((a, b) => {
      const getPriority = (relation: FriendRelation, isOnline: boolean) => {
        switch (relation) {
          case 'REQUEST_RECEIVED':
            return 1;
          case 'REQUEST_SENT':
            return 2;
          case 'FRIEND':
            return isOnline ? 3 : 4;
          case 'BLOCKED':
            return 5;
          default:
            return 99;
        }
      };
      const priorityA = getPriority(a.relation, a.isOnline);
      const priorityB = getPriority(b.relation, b.isOnline);
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.nickname.localeCompare(b.nickname);
    });
  }, [searchKeyword, friends]);

  return {
    processedFriends,
    searchResults,
    searchUsers,
    recommendedFriends,
    requestFriend,
    refreshRecommended,
    acceptFriend,
    removeFriend,
    blockFriend,
    isLoading,
  };
};
