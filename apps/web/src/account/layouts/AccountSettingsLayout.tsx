import { Link, NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "../../routes";

const navItemClass =
  "flex h-[2.3125rem] w-full items-center pl-4 text-[0.8125rem] leading-[1.21875rem] no-underline";
const navInactive = `${navItemClass} font-normal text-tab-inactive`;
const navActive = `${navItemClass} bg-[#EDE9E3] font-bold text-todo-text`;

export default function AccountSettingsLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[50rem]">
        <header className="flex h-12 items-center justify-between border-b-2 border-dark px-4.5 py-2.5">
          <Link
            to={ROUTES.TODOS}
            className="text-[1.0625rem] font-bold leading-[1.59375rem] tracking-[0.0588em] text-[#0A0A0A] no-underline hover:opacity-85"
          >
            ✓ TodoList
          </Link>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-[0.875rem] border-2 border-dark bg-[#E0DDD8]">
            <span className="text-[0.6875rem] leading-[1.03125rem] text-dark">
              JD
            </span>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-3rem)]">
          <aside className="flex w-[12.5rem] shrink-0 flex-col border-r-2 border-dark bg-input-bg pt-3">
            <nav className="flex flex-col gap-0.5">
              <NavLink
                to={ROUTES.SETTINGS_PROFILE}
                className={({ isActive }) => (isActive ? navActive : navInactive)}
              >
                프로필 수정
              </NavLink>
              <NavLink
                to={ROUTES.SETTINGS_PASSWORD}
                className={({ isActive }) => (isActive ? navActive : navInactive)}
              >
                비밀번호 변경
              </NavLink>
              <NavLink
                to={ROUTES.SETTINGS_ACCOUNT_LINK}
                className={({ isActive }) => (isActive ? navActive : navInactive)}
              >
                계정 연동
              </NavLink>
              <NavLink
                to={ROUTES.SETTINGS_WITHDRAW}
                className={({ isActive }) => (isActive ? navActive : navInactive)}
              >
                회원 탈퇴
              </NavLink>
            </nav>
          </aside>
          <main className="min-w-0 flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
