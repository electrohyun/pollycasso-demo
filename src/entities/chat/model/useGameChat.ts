import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useAuthStore } from '@/entities/user';
import { useGameSocket } from '@/shared/api/socket/GameSocketProvider';
import type { ChatMessage } from '@/shared/model';

export const useGameChat = () => {
  const { gameSocket } = useGameSocket();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const messageListRef = useRef<HTMLDivElement>(null);
  const MY_USER_ID = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!gameSocket) return;

    const handleNewMessage = (newMsg: ChatMessage) => {
      setMessages((prev) => [...prev, newMsg]);
    };

    const handleSystemMessage = (sysMsg: ChatMessage) => {
      setMessages((prev) => [...prev, { ...sysMsg, channel: 'system' }]);
    };

    gameSocket.on('room:message', handleNewMessage);
    gameSocket.on('chat:systemMessage', handleSystemMessage);

    return () => {
      gameSocket.off('room:message', handleNewMessage);
      gameSocket.off('chat:systemMessage', handleSystemMessage);
    };
  }, [gameSocket]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !gameSocket) return;

    gameSocket.emit('room:send', {
      channel: 'global',
      message: input.trim(),
    });

    setInput('');
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messageListRef,
    state: {
      messages,
      input,
      myUserId: MY_USER_ID,
    },
    actions: {
      setInput,
      handleSendMessage,
      handleKeyDown,
    },
  };
};
