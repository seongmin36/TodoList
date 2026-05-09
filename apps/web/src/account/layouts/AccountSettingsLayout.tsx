import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "@/routes";
import { TodoAppHeader } from "@/todo/components/TodoAppHeader";

const navItemClass =
  "flex h-[2.3125rem] w-full items-center pl-4 text-[0.8125rem] leading-[1.21875rem] no-underline";
const navInactive = `${navItemClass} font-normal text-tab-inactive`;
const navActive = `${navItemClass} bg-[#EDE9E3] font-bold text-todo-text`;

export default function AccountSettingsLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full">
        <TodoAppHeader />

        <div className="flex min-h-[calc(100vh-3rem)]">
          <aside className="flex w-[12.5rem] shrink-0 flex-col border-r-2 border-dark bg-input-bg pt-3">
            <nav className="flex flex-col gap-0.5">
              <NavLink
                to={ROUTES.SETTINGS_PROFILE}
                className={({ isActive }) =>
                  isActive ? navActive : navInactive
                }
              >
                프로필 수정
              </NavLink>
              <NavLink
                to={ROUTES.SETTINGS_PASSWORD}
                className={({ isActive }) =>
                  isActive ? navActive : navInactive
                }
              >
                비밀번호 변경
              </NavLink>
              <NavLink
                to={ROUTES.SETTINGS_ACCOUNT_LINK}
                className={({ isActive }) =>
                  isActive ? navActive : navInactive
                }
              >
                계정 연동
              </NavLink>
              <NavLink
                to={ROUTES.SETTINGS_WITHDRAW}
                className={({ isActive }) =>
                  isActive ? navActive : navInactive
                }
              >
                회원 탈퇴
              </NavLink>
            </nav>
          </aside>
          <main className="min-w-0 flex-1 py-12 px-20">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
