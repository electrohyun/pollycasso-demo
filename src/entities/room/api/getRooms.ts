import { instance } from '@/shared/api';
import type { Room, RoomFilters } from '../model/types';
import { mockRooms } from './mockRooms';

interface GetRoomsResponse {
  rooms: Room[];
  hasNextPage: boolean;
  nextCursor: number | null;
}

const getMockRooms = (
  params: RoomFilters & { cursor?: number },
): GetRoomsResponse => {
  const limit = 10;
  const query = params.q?.trim().toLowerCase();

  const filteredRooms = mockRooms.filter((room) => {
    if (query) {
      const idMatch = room.id.toString().includes(query);
      const nameMatch = room.name.toLowerCase().includes(query);

      if (!idMatch && !nameMatch) return false;
    }

    if (params.mode && room.mode !== params.mode) return false;
    if (params.status && room.status !== params.status) return false;
    if (
      typeof params.isPrivate === 'boolean' &&
      room.isPrivate !== params.isPrivate
    ) {
      return false;
    }

    return true;
  });

  const cursorIndex =
    typeof params.cursor === 'number'
      ? filteredRooms.findIndex((room) => room.id === params.cursor)
      : -1;
  const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  const rooms = filteredRooms.slice(startIndex, startIndex + limit);
  const hasNextPage = filteredRooms.length > startIndex + limit;

  return {
    rooms,
    hasNextPage,
    nextCursor: hasNextPage ? rooms[rooms.length - 1]?.id ?? null : null,
  };
};

export const getRooms = async (
  params: RoomFilters & { cursor?: number },
): Promise<GetRoomsResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return getMockRooms(params);
  }

  const response = await instance.get<GetRoomsResponse>('rooms', {
    params,
  });
  return response.data;
};
