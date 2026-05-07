interface DividerProps {
  label?: string;
}

export function Divider({ label = '또는' }: DividerProps) {
  return (
    <div className="flex items-center gap-[10px] w-full h-[18px]">
      <div className="flex-1 h-px bg-[#ddd]" />
      <span className="font-['Pretendard',sans-serif] text-[12px] text-[#aaa] shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#ddd]" />
    </div>
  );
}
