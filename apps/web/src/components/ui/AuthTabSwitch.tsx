interface AuthTabSwitchProps {
  activeTab: 'login' | 'signup';
  onChange: (tab: 'login' | 'signup') => void;
}

export function AuthTabSwitch({ activeTab, onChange }: AuthTabSwitchProps) {
  const tabBase =
    'flex-1 h-[2.1875rem] rounded font-pretendard text-sm cursor-pointer border-0 transition-colors duration-150';

  return (
    <div className="flex border-2 border-dark rounded-md p-0.5 w-[10.5625rem] h-[2.4375rem]">
      <button
        type="button"
        onClick={() => onChange('login')}
        className={`${tabBase} ${activeTab === 'login' ? 'bg-dark text-white' : 'bg-transparent text-tab-inactive'}`}
      >
        로그인
      </button>
      <button
        type="button"
        onClick={() => onChange('signup')}
        className={`${tabBase} ${activeTab === 'signup' ? 'bg-dark text-white' : 'bg-transparent text-tab-inactive'}`}
      >
        회원가입
      </button>
    </div>
  );
}
