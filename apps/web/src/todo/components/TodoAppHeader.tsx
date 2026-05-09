import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

const avatarLinkClass =
  "flex size-7 shrink-0 items-center justify-center rounded-[0.875rem] border-2 border-dark bg-[#E0DDD8] no-underline";

export function ProfileAvatarLink() {
  return (
    <Link
      to={ROUTES.SETTINGS_PROFILE}
      className={avatarLinkClass}
      aria-label="프로필 설정"
    >
      <span className="text-[0.6875rem] leading-[1.03125rem] text-dark">
        JD
      </span>
    </Link>
  );
}

export type TodoAppHeaderProps = {
  /** 비우면 기본: 프로필(JD) 링크 */
  trailing?: ReactNode;
  /**
   * emphasis: 휴지통·설정 등 피그마 헤더(2px dark, 로고 트래킹)
   * subtle: 메인 투두 목록 기존 스타일(border-divider)
   */
  edge?: "emphasis" | "subtle";
};

export function TodoAppHeader({
  trailing,
  edge = "emphasis",
}: TodoAppHeaderProps) {
  const shell =
    edge === "emphasis"
      ? "border-b-2 border-dark px-4.5"
      : "border-b border-divider px-4.5";

  const logoClass =
    "text-[1.0625rem] font-bold leading-[1.59375rem] tracking-[0.0588em] text-[#0A0A0A] no-underline hover:opacity-85";

  return (
    <header className={`flex h-12 items-center justify-between ${shell}`}>
      <Link to={ROUTES.TODOS} className={logoClass}>
        ✓ TodoList
      </Link>
      {trailing ?? <ProfileAvatarLink />}
    </header>
  );
}
