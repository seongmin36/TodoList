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
    <div className="flex flex-col gap-[2px] w-full">
      <label className="font-pretendard text-[12px] text-label leading-[18px]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
        className="h-[36px] bg-input-bg border-[1.5px] border-border-input rounded-[4px] px-[10px] py-[8px] font-pretendard text-[13px] text-dark/80 placeholder:text-placeholder outline-none focus:border-dark transition-colors duration-150 w-full"
      />
    </div>
  );
}
