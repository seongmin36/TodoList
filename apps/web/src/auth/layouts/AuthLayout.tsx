import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-white">
      <div className="flex w-[50rem] h-app-shell shadow-[0_0.25rem_2rem_rgba(0,0,0,0.10)]">
        {/* 사이드바 */}
        <aside className="w-[21.25rem] h-full bg-sidebar flex items-center justify-center shrink-0">
          <div className="flex flex-col items-center gap-3">
            <span className="font-bold text-[2.5rem] text-white leading-[3.75rem]">
              ✓
            </span>
            <span className="font-bold text-2xl text-white leading-9">
              TodoList
            </span>
            <p className="text-[0.8125rem] text-muted text-center leading-[1.3rem] m-0">
              일상의 투두를
              <br />
              깔끔하게 관리하세요
            </p>
          </div>
        </aside>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 bg-white relative overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
