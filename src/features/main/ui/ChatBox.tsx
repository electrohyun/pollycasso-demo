import type { Friend, ChatMessage } from '@/features/main/model/types';

import MessageList from './MessageList';
import ChatInputContainer from './ChatInputContainer';

interface ChatBoxProps {
  messages: ChatMessage[];
  input: string;

  selectedChannel: { label: string; value: string };
  isDropdownOpen: boolean;
  isMentionOpen: boolean;

  filteredFriends: Friend[];
  highlightIndex: number;

  messagesEndRef: React.RefObject<HTMLDivElement | null>;

  onChangeInput: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;

  onChannelToggle: () => void;
  onSelectChannel: (value: string) => void;

  setIsComposing: (v: boolean) => void;
  onSelectMention: (friend: Friend) => void;
}

export default function ChatBox({
  messages,
  input,
  selectedChannel,
  isDropdownOpen,
  isMentionOpen,
  filteredFriends,
  highlightIndex,
  messagesEndRef,

  onChangeInput,
  onKeyDown,
  onSend,
  onChannelToggle,
  onSelectChannel,
  setIsComposing,
  onSelectMention,
}: ChatBoxProps) {
  return (
    <div className="relative mt-5 w-[1020px] h-[190px] rounded-b-2xl bg-white/70 border border-[#c0c8b0] shadow-sm p-4 flex flex-col justify-between">
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />

      <ChatInputContainer
        input={input}
        selectedChannel={selectedChannel}
        isDropdownOpen={isDropdownOpen}
        isMentionOpen={isMentionOpen}
        filteredFriends={filteredFriends}
        highlightIndex={highlightIndex}
        onChangeInput={onChangeInput}
        onKeyDown={onKeyDown}
        setIsComposing={setIsComposing}
        onToggleChannel={onChannelToggle}
        onSelectChannel={onSelectChannel}
        onSend={onSend}
        onSelectMention={onSelectMention}
      />
    </div>
  );
}
