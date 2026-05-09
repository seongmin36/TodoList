interface DividerProps {
  label?: string;
}

export function Divider({ label = "또는" }: DividerProps) {
  return (
    <div className="flex h-divider items-center gap-2.5 w-full">
      <div className="flex-1 h-px bg-divider" />
      <span className="text-xs text-muted shrink-0">{label}</span>
      <div className="flex-1 h-px bg-divider" />
    </div>
  );
}
