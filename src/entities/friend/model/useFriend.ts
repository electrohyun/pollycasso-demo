import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFriendSocket } from '@/shared/api/socket/FriendSocketProvider';
import { useFriendStore } from './friendStore';
import {
  PORTFOLIO_FRIENDS,
  PORTFOLIO_RECOMMENDED_FRIENDS,
  PORTFOLIO_SEARCH_USERS,
} from './portfolioFriendData';
import { showToast } from '@/shared/ui/Toast';

export const useFriend = (searchKeyword: string = '') => {
  const isMock = import.meta.env.VITE_USE_MOCK === 'true';
  const { friendSocket: socket } = useFriendSocket();
  const [mockSearchResults, setMockSearchResults] = useState<
    typeof PORTFOLIO_RECOMMENDED_FRIENDS
  >([]);
  const {
    friends,
    recommendedFriends,
    searchResults,
    isLoading,
    initListeners,
    setSearchResults,
  } = useFriendStore();

  useEffect(() => {
    if (isMock) return;
    if (!socket) return;

    const setup = () => {
      initListeners(socket);

      socket.emit('friends:getList');
      socket.emit('friends:getRecommendedList');
    };

    if (socket.connected) {
      setup();
    } else {
      socket.once('connect', setup);
    }
  }, [socket, initListeners, isMock]);

  const requestFriend = useCallback(
    (targetUserId: number) => {
      if (isMock) {
        showToast.success('친구 신청을 보냈습니다.');
        return;
      }
      if (!socket) return;
      socket.emit('friends:requestSend', { targetUserId });
    },
    [socket, isMock],
  );

  const handleFriendAction = useCallback(
    (
      targetUserId: number,
      action: 'ACCEPT' | 'BLOCK' | 'DELETE' | 'CANCEL' | 'REJECT' | 'UNBLOCK',
    ) => {
      if (isMock) {
        showToast.info('포트폴리오 데모에서는 친구 상태를 실제로 변경하지 않습니다.');
        return;
      }
      if (!socket) return;

      const actionMap = {
        ACCEPT: {
          event: 'friends:requestAccept',
          data: { requesterId: targetUserId },
        },
        BLOCK: { event: 'friends:block', data: { targetUserId } },
        DELETE: { event: 'friends:delete', data: { targetUserId } },
        CANCEL: { event: 'friends:delete', data: { targetUserId } },
        REJECT: { event: 'friends:delete', data: { targetUserId } },
        UNBLOCK: { event: 'friends:delete', data: { targetUserId } },
      };

      const config = actionMap[action];
      if (config) {
        socket.emit(config.event, config.data);
      }
    },
    [socket, isMock],
  );

  const searchUsers = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) {
        if (isMock) {
          setMockSearchResults([]);
          return;
        }
        return setSearchResults([]);
      }

      if (isMock) {
        const normalizedKeyword = keyword.trim().toLowerCase();
        setMockSearchResults(
          PORTFOLIO_SEARCH_USERS.filter((user) => {
            const label = `${user.nickname}#${user.tag}`.toLowerCase();
            return label.includes(normalizedKeyword);
          }),
        );
        return;
      }

      socket?.emit('friends:search', { keyword });
    },
    [socket, setSearchResults, isMock],
  );

  const processedFriends = useMemo(() => {
    const sourceFriends = isMock ? PORTFOLIO_FRIENDS : friends;

    return sourceFriends
      .filter((f) =>
        `${f.nickname}#${f.tag}`
          .toLowerCase()
          .includes(searchKeyword.toLowerCase()),
      )
      .sort((a, b) => a.nickname.localeCompare(b.nickname));
  }, [searchKeyword, friends, isMock]);

  return {
    processedFriends,
    searchResults: isMock ? mockSearchResults : searchResults,
    recommendedFriends: isMock
      ? PORTFOLIO_RECOMMENDED_FRIENDS
      : recommendedFriends,
    handleFriendAction,
    requestFriend,
    searchUsers,
    isLoading: isMock ? false : isLoading,
  };
};
