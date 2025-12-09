import type { RoomState } from '@/entities/game/model';
import { MOCK_ROOM_STATE } from '@/mocks/game.mock';

type Listener = (...args: any[]) => void;

export class MockSocket {
  private listeners: Record<string, Listener[]> = {};
  private roomState: RoomState;

  public connected: boolean = false;
  public auth: { token?: string } = {};

  constructor() {
    this.roomState = JSON.parse(JSON.stringify(MOCK_ROOM_STATE));
    this.connect();
  }

  connect() {
    if (this.connected) return;
    this.connected = true;
    setTimeout(() => {
      this.trigger('connect');
      this.trigger('room:stateSync', this.roomState);
    }, 100);
  }

  disconnect() {
    this.connected = false;
    this.trigger('disconnect');
  }

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback?: Listener) {
    if (!this.listeners[event]) return;
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      );
    } else {
      delete this.listeners[event];
    }
  }

  emit(event: string, ...args: any[]) {
    const payload = args[0] || {};

    if (event === 'lobby:send') {
      const { message } = payload;

      const mainChatMsg = {
        id: Date.now().toString(),
        senderId: 'test-user',
        nickname: '테스트유저(Mock1)',
        message: message,
      };
      this.trigger('lobby:message', mainChatMsg);
    }

    if (event === 'room:join') {
      this.broadcastRoomState();
    }

    if (event === 'room:readyToggle') {
      const userId = payload.userId || this.roomState.players[0]?.userId;

      const player = this.roomState.players.find((p) => p.userId === userId);
      if (player) {
        player.isReady = !player.isReady;
        this.broadcastRoomState();
      }
    }

    if (event === 'room:changeTeam') {
      const { targetTeamId, userId } = payload;
      const targetUser = userId || this.roomState.players[0]?.userId;

      const player = this.roomState.players.find(
        (p) => p.userId === targetUser,
      );
      if (player) {
        player.teamId = targetTeamId;
        player.isReady = false;
        this.broadcastRoomState();
      }
    }

    if (event === 'room:kickUser') {
      const { targetUserId } = payload;
      this.roomState.players = this.roomState.players.filter(
        (p) => p.userId !== targetUserId,
      );
      this.broadcastRoomState();
    }

    if (event === 'room:leave') {
      console.log('[Mock] 유저 퇴장');
    }

    if (event === 'chat:sendMessage') {
      const { message, userId } = payload;
      const sender =
        this.roomState.players.find((p) => p.userId === userId) ||
        this.roomState.players[0];

      const newChatMessage = {
        id: Date.now().toString(),
        senderId: sender?.userId,
        nickname: sender?.nickname,
        message: message,
      };

      this.trigger('chat:newMessage', newChatMessage);
    }
  }

  private broadcastRoomState() {
    const newState = JSON.parse(JSON.stringify(this.roomState));
    this.trigger('room:stateSync', newState);
  }

  private trigger(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(...args));
    }
  }
}
