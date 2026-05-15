const DEFAULT_TAG_COLOR = "#888888";

interface TodoTagProps {
  name: string;
  color: string | null;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function TodoTag({ name, color }: TodoTagProps) {
  const resolvedColor = color ?? DEFAULT_TAG_COLOR;
  return (
    <span
      className="inline-flex h-tag items-center px-[0.4375rem] border-[1.5px] rounded-[0.625rem] text-[0.6875rem] leading-[1.03125rem] shrink-0 whitespace-nowrap"
      style={{
        color: resolvedColor,
        borderColor: resolvedColor,
        backgroundColor: hexToRgba(resolvedColor, 0.13),
      }}
    >
      {name}
    </span>
  );
}
