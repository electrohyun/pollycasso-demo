import { useEffect, useMemo, useState } from 'react';

import type { FriendProfile, FriendRelation } from '@/entities/friend';

type Friend = FriendProfile & { relation: FriendRelation };

const DUMMY_DATA: Friend[] = [
  {
    userId: 1,
    nickname: '차단한사람#1111',
    level: 10,
    relation: 'BLOCKED',
    isOnline: false,
    outfit: undefined,
  },
  {
    userId: 2,
    nickname: '짱친#1234',
    level: 60,
    relation: 'FRIEND',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 3,
    nickname: '친구신청받아#5555',
    level: 1,
    relation: 'REQUEST_RECEIVED',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 4,
    nickname: '내가신청보냄#7777',
    level: 25,
    relation: 'REQUEST_SENT',
    isOnline: false,
    outfit: undefined,
  },
  {
    userId: 5,
    nickname: '자러감#9999',
    level: 40,
    relation: 'FRIEND',
    isOnline: false,
    outfit: undefined,
  },
  {
    userId: 6,
    nickname: '프론트장인#0001',
    level: 45,
    relation: 'FRIEND',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 7,
    nickname: '리액트깎는노인#2024',
    level: 99,
    relation: 'FRIEND',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 8,
    nickname: '스프링러버#7788',
    level: 12,
    relation: 'REQUEST_RECEIVED',
    isOnline: false,
    outfit: undefined,
  },
  {
    userId: 9,
    nickname: '타입스크립트어려워#1102',
    level: 5,
    relation: 'REQUEST_SENT',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 10,
    nickname: '빌런#6666',
    level: 30,
    relation: 'BLOCKED',
    isOnline: false,
    outfit: undefined,
  },
  {
    userId: 11,
    nickname: '코딩중졸림#8888',
    level: 22,
    relation: 'FRIEND',
    isOnline: false,
    outfit: undefined,
  },
  {
    userId: 12,
    nickname: '아메리카노중독#4421',
    level: 55,
    relation: 'FRIEND',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 13,
    nickname: '배포성공기원#9001',
    level: 18,
    relation: 'REQUEST_SENT',
    isOnline: false,
    outfit: undefined,
  },
  {
    userId: 14,
    nickname: '밤샘모드#0000',
    level: 72,
    relation: 'FRIEND',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 15,
    nickname: '말걸면차단#1212',
    level: 3,
    relation: 'BLOCKED',
    isOnline: true,
    outfit: undefined,
  },
  {
    userId: 16,
    nickname: '알고리즘싫어#3344',
    level: 41,
    relation: 'FRIEND',
    isOnline: false,
    outfit: undefined,
  },
];

export const useFriendList = (searchKeyword: string) => {
  const [isLoading, setIsLoading] = useState(true);

  const [friends, setFriends] = useState<Friend[]>([]);

  const acceptFriend = (targetId: number | string) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.userId === targetId ? { ...f, relation: 'FRIEND' } : f,
      ),
    );
  };

  const removeFriend = (targetId: number | string) => {
    setFriends((prev) => prev.filter((f) => f.userId !== targetId));
  };

  const blockFriend = (targetId: number | string) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.userId === targetId ? { ...f, relation: 'BLOCKED' } : f,
      ),
    );
  };

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setFriends(DUMMY_DATA);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    processedFriends,
    acceptFriend,
    removeFriend,
    blockFriend,
    isLoading,
  };
};
