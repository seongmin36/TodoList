interface DividerProps {
  label?: string;
}

export function Divider({ label = '또는' }: DividerProps) {
  return (
    <div className="flex items-center gap-2.5 w-full h-[1.125rem]">
      <div className="flex-1 h-px bg-divider" />
      <span className="font-pretendard text-xs text-muted shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-divider" />
    </div>
  );
}
