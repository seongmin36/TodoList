import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginInput } from "@repo/schemas";
import { AuthTabSwitch } from "@/auth/components/AuthTabSwitch";
import { Button } from "@/shared/components/Button";
import { Divider } from "@/shared/components/Divider";
import { Input } from "@/shared/components/Input";
import { ROUTES } from "@/routes";
import GoogleIcon from "@/assets/logo/google.svg?react";

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (_data: LoginInput) => {
    // TODO: 로그인 API 연동
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col px-10 pt-[6.9219rem]"
    >
      <AuthTabSwitch
        activeTab="login"
        onChange={(tab) => {
          if (tab === "signup") navigate(ROUTES.SIGNUP);
        }}
      />

      <div className="mt-6 flex flex-col gap-2.5">
        <Input
          label="이메일"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="mt-4">
        <Button type="submit" fullWidth>
          로그인
        </Button>
      </div>

      <div className="mt-3.5">
        <Divider />
      </div>

      <div className="mt-3.5">
        <Button variant="outline" fullWidth>
          <span className="flex items-center justify-center gap-2">
            <GoogleIcon width={16} height={16} />
            <span>Google로 로그인</span>
          </span>
        </Button>
      </div>
    </form>
  );
}
