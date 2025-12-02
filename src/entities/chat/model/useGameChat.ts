import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { getSocket } from '@/shared/api/socket';
import type { ChatMessage } from '@/entities/chat/model/types';

const MY_USER_ID = 'id-1234';

export const useGameChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (newMsg: any) => {
      const formattedMsg: ChatMessage = {
        id: newMsg.id || Date.now().toString(),
        senderId: newMsg.senderId,
        nickname: newMsg.senderName,
        message: newMsg.content,
        channel: '전체',
      };
      setMessages((prev) => [...prev, formattedMsg]);
    };

    socket.on('chatMessage', handleNewMessage);

    return () => {
      socket.off('chatMessage', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    getSocket().emit('sendChat', {
      userId: MY_USER_ID,
      message: input,
    });

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      handleSendMessage();
    }
  };

  return {
    messagesEndRef,
    state: {
      messages,
      input,
      myUserId: MY_USER_ID,
    },
    actions: {
      setInput,
      setIsComposing,
      handleSendMessage,
      handleKeyDown,
    },
  };
};
