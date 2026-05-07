import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTabSwitch } from "../components/ui/AuthTabSwitch";
import { Button } from "../components/ui/Button";
import { Divider } from "../components/ui/Divider";
import { Input } from "../components/ui/Input";
import { ROUTES } from "../routes";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: login API 연동
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col px-[40px] pt-[110.75px]"
    >
      <AuthTabSwitch
        activeTab="login"
        onChange={(tab) => {
          if (tab === "signup") navigate(ROUTES.SIGNUP);
        }}
      />

      <div className="mt-[24px] flex flex-col gap-[10px]">
        <Input
          label="이메일"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <div className="mt-[16px]">
        <Button type="submit" fullWidth>
          로그인
        </Button>
      </div>

      <div className="mt-[14px]">
        <Divider />
      </div>

      <div className="mt-[14px]">
        <Button variant="outline" fullWidth>
          <span className="flex items-center justify-center gap-[8px]">
            <span className="font-bold text-[14px]">G</span>
            <span>Google로 로그인</span>
          </span>
        </Button>
      </div>
    </form>
  );
}
