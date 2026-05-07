interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-white">
      <div className="flex w-[800px] h-[580px] shadow-[0_4px_32px_rgba(0,0,0,0.10)]">
        {/* 사이드바 */}
        <aside className="w-[340px] h-full bg-sidebar flex items-center justify-center shrink-0">
          <div className="flex flex-col items-center gap-[12px]">
            <span className="font-pretendard font-bold text-[40px] text-white leading-[60px]">
              ✓
            </span>
            <span className="font-pretendard font-bold text-[24px] text-white leading-[36px]">
              TodoList
            </span>
            <p className="font-pretendard text-[13px] text-muted text-center leading-[20.8px] m-0">
              일상의 투두를
              <br />
              깔끔하게 관리하세요
            </p>
          </div>
        </aside>

        {/* 콘텐츠 영역 */}
        <main className="flex-1 bg-white relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
