interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  onClick,
  disabled,
}: ButtonProps) {
  const base =
    "h-[38px] rounded-[4px] font-['Pretendard',sans-serif] text-[13px] font-bold cursor-pointer border-2 transition-opacity duration-150 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: 'bg-[#222] border-[#222] text-white',
    outline: 'bg-transparent border-[#aaa] text-[#222]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}
