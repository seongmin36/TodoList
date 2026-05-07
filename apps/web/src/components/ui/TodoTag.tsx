interface TodoTagProps {
  name: string;
  color: string; // hex e.g. "#4a90d9"
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function TodoTag({ name, color }: TodoTagProps) {
  return (
    <span
      className="inline-flex items-center h-[1.344rem] px-[0.4375rem] border-[1.5px] rounded-[0.625rem] text-[0.6875rem] leading-[1.03125rem] shrink-0 whitespace-nowrap"
      style={{
        color,
        borderColor: color,
        backgroundColor: hexToRgba(color, 0.13),
      }}
    >
      {name}
    </span>
  );
}
