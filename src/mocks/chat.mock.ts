import { http, HttpResponse } from 'msw';

import type { ChatChannel, Friend } from '@/shared/model';

interface ChannelOption {
  label: string;
  value: ChatChannel;
}

export const mockChannels: ChannelOption[] = [
  { label: '[전체]', value: 'global' },
  { label: '[친구]', value: 'direct' },
];

export const mockFriends: Friend[] = [
  { userId: 25, nickname: '테스트용계정2' },
  { userId: 2, nickname: '안전한백엔드' },
  { userId: 3, nickname: 'aa1' },
  { userId: 4, nickname: 'a' },
  { userId: 5, nickname: 'asdf11' },
];

export const chatHandlers = [
  http.get('mock/friends', ({ request }) => {
    const url = new URL(request.url);
    const error = url.searchParams.get('error');

    if (error === 'servererror') {
      return HttpResponse.json(
        { code: 500, message: '친구 목록 조회 실패', errors: [] },
        { status: 500 },
      );
    }

    return HttpResponse.json(mockFriends, { status: 200 });
  }),

  http.get('mock/channels', () => {
    return HttpResponse.json(mockChannels, { status: 200 });
  }),
];
