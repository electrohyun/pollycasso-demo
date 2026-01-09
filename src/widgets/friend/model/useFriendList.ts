import { useCallback, useEffect, useMemo, useState } from 'react';

import type { FriendProfile, FriendRelation } from '@/entities/friend';
import { io, SOCKET_EVENTS } from '@/shared/api/socket';

type Friend = FriendProfile & { relation: FriendRelation };

export const useFriendList = (searchKeyword: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);

  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL), []);

  useEffect(() => {
    const handleListResponse = (data: Friend[]) => {
      setFriends(data);
      setIsLoading(false);
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

    socket.emit(SOCKET_EVENTS.FRIEND_GET_ALL);

    return () => {
      socket.off(SOCKET_EVENTS.FRIEND_GET_ALL_RESPONSE, handleListResponse);
      socket.off(SOCKET_EVENTS.FRIEND_STATUS_UPDATE, handleStatusUpdate);
    };
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
    acceptFriend,
    removeFriend,
    blockFriend,
    isLoading,
  };
};
