import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/shared/api/socket';
import { MessageList } from '@/entities/chat/ui/MessageList';
import { ChatInput } from '@/entities/chat/ui/ChatInput';
import { ChatSendButton } from '@/entities/chat/ui/ChatSendButton';
import type { ChatMessage } from '@/entities/chat/model/types';

export const GameChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const MY_USER_ID = 'id-1234';

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    getSocket().emit('sendChat', {
      userId: MY_USER_ID,
      message: input,
    });

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white/40 rounded-2xl overflow-hidden border border-white/5">
      <MessageList
        messages={messages}
        messagesEndRef={messagesEndRef}
        className="flex-1 p-4 h-full text-white"
        currentUserId={MY_USER_ID}
      />

      <div className="flex gap-2 items-center border-t border-white/10">
        <div className="flex-1 bg-white rounded-xl overflow-hidden h-12 flex items-center">
          <ChatInput
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            setIsComposing={setIsComposing}
            placeholder="채팅 입력..."
            className="w-full text-base text-black placeholder-gray-500"
          />
          <ChatSendButton disabled={!input.trim()} onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
