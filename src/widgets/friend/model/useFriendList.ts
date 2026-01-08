import { useMemo } from 'react';

import type { FriendRelation } from '@/entities/friend';

const DUMMY_DATA = [
  {
    id: 1,
    nickname: '차단한사람#1111',
    level: 10,
    relation: 'BLOCKED',
    isOnline: false,
  },
  {
    id: 2,
    nickname: '짱친#1234',
    level: 60,
    relation: 'FRIEND',
    isOnline: true,
  },
  {
    id: 3,
    nickname: '친구신청받아#5555',
    level: 1,
    relation: 'REQUEST_RECEIVED',
    isOnline: true,
  },
  {
    id: 4,
    nickname: '내가신청보냄#7777',
    level: 25,
    relation: 'REQUEST_SENT',
    isOnline: false,
  },
  {
    id: 5,
    nickname: '자러감#9999',
    level: 40,
    relation: 'FRIEND',
    isOnline: false,
  },
] as const;

export const useFriendList = (searchKeyword: string) => {
  const friends = useMemo(() => {
    const filtered = DUMMY_DATA.filter((friend) => {
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

      const priorityA = getPriority(a.relation as FriendRelation, a.isOnline);
      const priorityB = getPriority(b.relation as FriendRelation, b.isOnline);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.nickname.localeCompare(b.nickname);
    });
  }, [searchKeyword]);

  return friends;
};
