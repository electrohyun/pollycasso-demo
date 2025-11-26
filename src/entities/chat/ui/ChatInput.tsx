interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setIsComposing: (v: boolean) => void;
  className?: string;
  placeholder?: string;
}

export const ChatInput = ({
  value,
  onChange,
  onKeyDown,
  setIsComposing,
  className,
}: ChatInputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      maxLength={50}
      className={`px-3 outline-none h-full bg-transparent font-normal text-lg ${className}`}
      placeholder="메세지를 보내주세요!"
    />
  );
};
