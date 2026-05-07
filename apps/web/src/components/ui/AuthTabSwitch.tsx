interface AuthTabSwitchProps {
  activeTab: 'login' | 'signup';
  onChange: (tab: 'login' | 'signup') => void;
}

export function AuthTabSwitch({ activeTab, onChange }: AuthTabSwitchProps) {
  const tabBase =
    "flex-1 h-[35px] rounded-[4px] font-['Pretendard',sans-serif] text-[14px] cursor-pointer border-0 transition-colors duration-150";

  return (
    <div className="flex border-2 border-[#222] rounded-[6px] p-[2px] w-[169px] h-[39px]">
      <button
        type="button"
        onClick={() => onChange('login')}
        className={`${tabBase} ${activeTab === 'login' ? 'bg-[#222] text-white' : 'bg-transparent text-[#666]'}`}
      >
        로그인
      </button>
      <button
        type="button"
        onClick={() => onChange('signup')}
        className={`${tabBase} ${activeTab === 'signup' ? 'bg-[#222] text-white' : 'bg-transparent text-[#666]'}`}
      >
        회원가입
      </button>
    </div>
  );
}
