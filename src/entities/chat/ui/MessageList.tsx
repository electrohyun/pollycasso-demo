import type { ChatMessage } from '@/entities/chat';

interface MessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  currentUserId?: string;
  showChannelTag?: boolean;
}

export const MessageList = ({
  messages,
  messagesEndRef,
  className,
  currentUserId,
  showChannelTag,
}: MessageListProps) => {
  return (
    <div
      ref={messagesEndRef}
      className={`flex flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D3D3D3] scrollbar-track-transparent pr-2 text-sm leading-tight ${className}`}
    >
      {messages.length === 0 ? (
        <p className="text-[20px] text-gray-400">메세지를 보내주세요!</p>
      ) : (
        messages.map((msg, i) => {
          const isFriend = msg.channel === '친구';
          const isMe = msg.senderId === currentUserId;
          const showTag = showChannelTag && !isFriend;

          return (
            <p
              key={i}
              // ▼▼▼ 여기를 수정했습니다 ▼▼▼
              className={`text-base leading-tight px-1 rounded-md ${
                isFriend
                  ? 'text-[#305946] font-bold'
                  : isMe
                    ? 'text-[#005299]'
                    : 'text-black'
              }`}
            >
              {isFriend ? (
                <>
                  <span className="text-[20px]">
                    [친구] {msg.targetNickname}에게 :
                  </span>
                  <span className="text-[20px]"> {msg.message}</span>
                </>
              ) : (
                <>
                  {showTag && (
                    <span className="font-bold text-[20px] mr-1">[전체]</span>
                  )}

                  <span className={`text-[20px] ${isMe ? 'font-bold' : ''}`}>
                    {isMe ? '나' : msg.nickname} :{' '}
                  </span>
                  <span className="text-[20px]">{msg.message}</span>
                </>
              )}
            </p>
          );
        })
      )}
    </div>
  );
};
