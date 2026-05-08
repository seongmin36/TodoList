import { useState } from "react";

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState("JohnDoe");

  return (
    <div className="flex max-w-[34.5rem] flex-col gap-4">
      <h1 className="m-0 text-[0.9375rem] font-bold leading-[1.40625rem] text-todo-text">
        프로필 수정
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex size-[3.75rem] shrink-0 items-center justify-center rounded-full border-2 border-dark bg-[#E0DDD8]">
          <span className="text-[1.375rem] font-bold leading-[2.0625rem] text-dark">
            JD
          </span>
        </div>
        <button
          type="button"
          className="h-[1.875rem] w-[5.175rem] shrink-0 rounded border-2 border-border-input bg-transparent text-xs leading-[1.125rem] text-[#444444] hover:opacity-85"
        >
          이미지 변경
        </button>
      </div>

      <div className="w-[16.25rem]">
        <label className="mb-2 block text-xs leading-[1.125rem] text-label">
          닉네임
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="box-border h-9 w-full rounded border-[0.09375rem] border-border-input bg-input-bg px-2.5 py-2 text-[0.8125rem] leading-[1.21875rem] text-dark outline-none focus:border-dark"
        />
      </div>

      <div className="w-[16.25rem]">
        <label className="mb-2 block text-xs leading-[1.125rem] text-label">
          이메일 (읽기전용)
        </label>
        <input
          type="email"
          readOnly
          value="john@email.com"
          className="box-border h-9 w-full cursor-not-allowed rounded border-[0.09375rem] border-border-input bg-[#F0EFED] px-2.5 py-2 text-[0.8125rem] leading-[1.21875rem] text-border-input outline-none"
        />
      </div>

      <button
        type="button"
        className="h-9 w-[7.5rem] rounded border-2 border-dark bg-dark text-[0.8125rem] font-bold leading-[1.21875rem] text-white hover:opacity-85"
      >
        저장
      </button>
    </div>
  );
}
