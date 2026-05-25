import type { Room } from '../model/types';

export const DEMO_HOST_ROOM_ID = 9001;
export const DEMO_GUEST_ROOM_ID = 9002;
export const DEMO_ROOM_IDS = [9001, 9002, 9003, 9004, 9005, 9006] as const;

export const mockRooms: Room[] = [
  {
    id: DEMO_HOST_ROOM_ID,
    name: '당신이 방장!',
    mode: 'SOLO',
    currentPlayers: 2,
    maxPlayers: 4,
    status: 'WAITING',
    isPrivate: false,
  },
  {
    id: DEMO_GUEST_ROOM_ID,
    name: '당신은 손님!',
    mode: 'SOLO',
    currentPlayers: 3,
    maxPlayers: 4,
    status: 'WAITING',
    isPrivate: false,
  },
  {
    id: 9003,
    name: '친구랑 비밀방',
    mode: 'SOLO',
    currentPlayers: 2,
    maxPlayers: 4,
    status: 'WAITING',
    isPrivate: true,
  },
  {
    id: 9004,
    name: '초대 전용방',
    mode: 'TEAM',
    currentPlayers: 6,
    maxPlayers: 6,
    status: 'WAITING',
    isPrivate: true,
  },
  {
    id: 9005,
    name: '고수만 입장',
    mode: 'TEAM',
    currentPlayers: 4,
    maxPlayers: 6,
    status: 'WAITING',
    isPrivate: true,
  },
  {
    id: 9006,
    name: '잠금 연습방',
    mode: 'SOLO',
    currentPlayers: 3,
    maxPlayers: 4,
    status: 'WAITING',
    isPrivate: true,
  },
];
