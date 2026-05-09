interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "투두 검색...",
}: SearchInputProps) {
  return (
    <div className="flex h-control items-center gap-1.5 w-[17.5rem] bg-input-bg border-[1.5px] border-border-input rounded px-2.5 py-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#888"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[0.8125rem] text-dark/80 placeholder:text-placeholder bg-transparent outline-none border-0"
      />
    </div>
  );
}
