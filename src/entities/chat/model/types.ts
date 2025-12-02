export interface Friend {
  id: number;
  name: string;
}

export type Channel = '전체' | '친구' | '안내';

export interface ChatMessage {
  id: string;
  senderId: string;
  nickname: string;
  message: string;
  channel?: Channel;
  targetNickname?: string;
}
