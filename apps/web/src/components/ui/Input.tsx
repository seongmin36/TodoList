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
      <label className="font-['Pretendard',sans-serif] text-[12px] text-[#555] leading-[18px]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
        className="h-[36px] bg-[#faf9f7] border-[1.5px] border-[#aaa] rounded-[4px] px-[10px] py-[8px] font-['Pretendard',sans-serif] text-[13px] text-[rgba(10,10,10,0.8)] placeholder:text-[rgba(10,10,10,0.5)] outline-none focus:border-[#222] transition-colors duration-150 w-full"
      />
    </div>
  );
}
