export interface Friend {
  id: number;
  name: string;
}

export type Channel = '전체' | '친구' | '시스템';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  channel: Channel;
  targetNickname?: string;
}
