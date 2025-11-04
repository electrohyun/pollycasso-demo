import type { Friend } from '@/features/main/model/types';
import ChannelSelect from './ChannelSelect';
import ChatInput from './ChatInput';
import ChatSendButton from './ChatSendButton';
import { MentionDropdown } from '@/features/main/ui/MentionDropdown';

interface ChatInputContainerProps {
  input: string;
  selectedChannel: { label: string; value: string };
  isDropdownOpen: boolean;
  isMentionOpen: boolean;

  filteredFriends: Friend[];
  highlightIndex: number;

  onChangeInput: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setIsComposing: (v: boolean) => void;

  onToggleChannel: () => void;
  onSelectChannel: (v: string) => void;

  onSend: () => void;
  onSelectMention: (friend: Friend) => void;
}

export default function ChatInputContainer({
  input,
  selectedChannel,
  isDropdownOpen,
  isMentionOpen,
  filteredFriends,
  highlightIndex,
  onChangeInput,
  onKeyDown,
  setIsComposing,
  onToggleChannel,
  onSelectChannel,
  onSend,
  onSelectMention,
}: ChatInputContainerProps) {
  const disableSend =
    input.trim() === '' || /^@[a-zA-Z0-9가-힣_]+$/.test(input.trim());

  return (
    <div className="flex mt-2 border-2 border-black rounded-xl overflow-hidden bg-white h-[50px] relative">
      <ChannelSelect
        selected={selectedChannel}
        isOpen={isDropdownOpen}
        onToggle={onToggleChannel}
        onSelect={onSelectChannel}
      />

      <ChatInput
        value={input}
        onChange={onChangeInput}
        onKeyDown={onKeyDown}
        setIsComposing={setIsComposing}
      />

      {isMentionOpen && (
        <MentionDropdown
          friends={filteredFriends}
          highlightIndex={highlightIndex}
          onSelect={onSelectMention}
        />
      )}

      <ChatSendButton disabled={disableSend} onSend={onSend} />
    </div>
  );
}
