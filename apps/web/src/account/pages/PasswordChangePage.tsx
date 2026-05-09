import { useState } from "react";

const fieldClass =
  "box-border h-9 w-full rounded border-[0.09375rem] border-border-input bg-input-bg px-2.5 py-2 text-[0.8125rem] leading-[1.21875rem] text-[#0A0A0A] outline-none placeholder:text-placeholder focus:border-dark";

export default function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex max-w-[34.5rem] flex-col gap-4">
      <h1 className="m-0 text-[0.9375rem] font-bold leading-[1.40625rem] text-todo-text">
        비밀번호 변경
      </h1>

      <div className="w-[16.25rem]">
        <label className="mb-2 block text-xs leading-[1.125rem] text-label">
          현재 비밀번호
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={fieldClass}
          autoComplete="current-password"
        />
      </div>

      <div className="w-[16.25rem]">
        <label className="mb-2 block text-xs leading-[1.125rem] text-label">
          새 비밀번호
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={fieldClass}
          autoComplete="new-password"
        />
      </div>

      <div className="w-[16.25rem]">
        <label className="mb-2 block text-xs leading-[1.125rem] text-label">
          새 비밀번호 확인
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={fieldClass}
          autoComplete="new-password"
        />
      </div>

      <button
        type="button"
        className="h-9 w-[7.5rem] rounded border-2 border-dark bg-dark text-[0.8125rem] font-bold leading-[1.21875rem] text-white hover:opacity-85"
      >
        변경
      </button>
    </div>
  );
}
