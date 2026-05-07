interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
}

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
}: InputProps) {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      <label className="font-pretendard text-xs text-label leading-[1.125rem]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
        className="h-9 bg-input-bg border-[1.5px] border-border-input rounded px-2.5 py-2 font-pretendard text-[0.8125rem] text-dark/80 placeholder:text-placeholder outline-none focus:border-dark transition-colors duration-150 w-full"
      />
    </div>
  );
}
