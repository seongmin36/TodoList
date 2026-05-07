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
    'h-9.5 rounded font-pretendard text-[0.8125rem] font-bold cursor-pointer border-2 transition-opacity duration-150 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-dark border-dark text-white',
    outline: 'bg-transparent border-border-input text-dark',
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
