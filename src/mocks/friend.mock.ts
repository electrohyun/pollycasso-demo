import type { FriendProfile, FriendRelation } from '@/entities/friend';
import { SOCKET_EVENTS } from '@/shared/api/socket';
import type { MockSocket } from '@/shared/api/socket/mockSocket';
import type { Outfit } from '@/shared/model';

export interface FriendWithRelation extends FriendProfile {
  relation: FriendRelation;
}

const createOutfit = (bird: string): Outfit => ({
  bird,
  accessory: null,
  hat: null,
  top: null,
  bottom: null,
  shoes: null,
  effect: null,
});

export const MOCK_FRIENDS: FriendWithRelation[] = [
  {
    userId: 1,
    nickname: '그림쟁이',
    tag: '1234',
    outfit: createOutfit('bird_03'),
    level: 25,
    isOnline: true,
    relation: 'FRIEND',
  },
  {
    userId: 2,
    nickname: '버그수집가',
    tag: '5678',
    outfit: createOutfit('bird_04'),
    level: 10,
    isOnline: false,
    relation: 'FRIEND',
  },
  {
    userId: 3,
    nickname: '친추주세요',
    tag: '1111',
    outfit: createOutfit('bird_05'),
    level: 5,
    isOnline: true,
    relation: 'REQUEST_RECEIVED',
  },
  {
    userId: 4,
    nickname: '묵묵부답',
    tag: '2222',
    outfit: createOutfit('bird_06'),
    level: 1,
    isOnline: false,
    relation: 'REQUEST_SENT',
  },
  {
    userId: 5,
    nickname: '비매너유저',
    tag: '9999',
    outfit: createOutfit('bird_02'),
    level: 99,
    isOnline: false,
    relation: 'BLOCKED',
  },
];

export const MOCK_RECOMMENDED: FriendProfile[] = [
  {
    userId: 101,
    nickname: '뉴비환영',
    tag: '0001',
    outfit: createOutfit('bird_01'),
    level: 2,
    isOnline: true,
  },
  {
    userId: 102,
    nickname: '같이해요',
    tag: '0002',
    outfit: createOutfit('bird_07'),
    level: 15,
    isOnline: false,
  },
  {
    userId: 103,
    nickname: '고수등장',
    tag: '7777',
    outfit: createOutfit('bird_08'),
    level: 50,
    isOnline: true,
  },
];

const MOCK_ALL_USERS: FriendProfile[] = [
  {
    userId: 1001,
    nickname: '검색테스트1',
    tag: '1111',
    outfit: createOutfit('bird_01'),
    level: 5,
    isOnline: true,
  },
  {
    userId: 1002,
    nickname: '검색테스트2',
    tag: '2222',
    outfit: createOutfit('bird_02'),
    level: 10,
    isOnline: false,
  },
  {
    userId: 1003,
    nickname: '숨은고수',
    tag: '9999',
    outfit: createOutfit('bird_03'),
    level: 99,
    isOnline: true,
  },
];

export const handleFriendGetList = (socket: MockSocket) => {
  socket.trigger(SOCKET_EVENTS.FRIEND_GET_ALL_RESPONSE, MOCK_FRIENDS);
};

export const handleFriendGetRecommended = (socket: MockSocket) => {
  socket.trigger(
    SOCKET_EVENTS.FRIEND_GET_RECOMMENDED_RESPONSE,
    MOCK_RECOMMENDED,
  );
};

export const handleFriendRequestSend = (socket: MockSocket, payload: any) => {
  const { targetNickname } = payload;

  if (targetNickname === '기현#0001' || targetNickname === 'me') {
    socket.trigger('system:notification', {
      status: 400,
      code: 'CANNOT_REQUEST_SELF',
      errors: [],
    });
    return;
  }

  const existingFriend = MOCK_FRIENDS.find(
    (friend) => friend.nickname === targetNickname && friend.relation === 'FRIEND',
  );

  if (existingFriend) {
    socket.trigger('system:notification', {
      status: 400,
      code: 'ALREADY_FRIEND',
      errors: [],
    });
    return;
  }

  const allKnownUsers = [
    ...MOCK_FRIENDS,
    ...MOCK_RECOMMENDED,
    ...MOCK_ALL_USERS,
  ];
  const userExists = allKnownUsers.find((user) => user.nickname === targetNickname);

  if (!userExists) {
    socket.trigger('system:notification', {
      status: 404,
      code: 'USER_NOT_FOUND',
      errors: [],
    });
    return;
  }

  socket.trigger('system:notification', {
    status: 200,
    code: 'FRIEND_REQUEST_SENT',
    message: `${targetNickname}에게 친구 요청을 보냈습니다.`,
  });
};

export const handleFriendAccept = (socket: MockSocket, payload: any) => {
  const { requesterId } = payload;
  socket.trigger(SOCKET_EVENTS.FRIEND_STATUS_UPDATE, {
    userId: requesterId,
    relation: 'FRIEND',
  });
  socket.trigger('system:notification', {
    status: 200,
    code: 'FRIEND_ACCEPTED',
    message: '친구 요청을 수락했습니다.',
  });
};

export const handleFriendBlock = (socket: MockSocket, payload: any) => {
  const { targetId } = payload;

  socket.trigger(SOCKET_EVENTS.FRIEND_STATUS_UPDATE, {
    userId: targetId,
    relation: 'BLOCKED',
  });
};

export const handleFriendDelete = (socket: MockSocket, payload: any) => {
  const { targetId } = payload;

  socket.trigger(SOCKET_EVENTS.FRIEND_STATUS_UPDATE, {
    userId: targetId,
    relation: 'NONE',
  });
};

export const handleFriendSearch = (socket: MockSocket, payload: any) => {
  const { keyword } = payload;

  if (!keyword) {
    socket.trigger(SOCKET_EVENTS.FRIEND_SEARCH_RESPONSE, []);
    return;
  }

  const myRelationIds = new Set(MOCK_FRIENDS.map((friend) => friend.userId));
  const finalResults = MOCK_ALL_USERS.filter(
    (user) => user.nickname.includes(keyword) && !myRelationIds.has(user.userId),
  );

  socket.trigger(SOCKET_EVENTS.FRIEND_SEARCH_RESPONSE, finalResults);
};
