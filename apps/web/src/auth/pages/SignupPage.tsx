import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { signupFormSchema, type SignupFormInput } from "@repo/schemas";
import { AuthTabSwitch } from "@/auth/components/AuthTabSwitch";
import { Button } from "@/shared/components/Button";
import { Divider } from "@/shared/components/Divider";
import { Input } from "@/shared/components/Input";
import { ROUTES } from "@/routes";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import GoogleIcon from "@/assets/logo/google.svg?react";

export default function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit = handleSubmit(async ({ passwordConfirm: _, ...data }) => {
    try {
      await authApi.signup(data);
      void navigate(ROUTES.LOGIN);
    } catch (e) {
      setError("root", {
        message:
          e instanceof ApiError ? e.message : "회원가입에 실패했습니다.",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col px-10 pt-[4.859rem]">
      <AuthTabSwitch
        activeTab="signup"
        onChange={(tab) => {
          if (tab === "login") void navigate(ROUTES.LOGIN);
        }}
      />

      <div className="mt-6 flex flex-col gap-2.5">
        <Input
          label="이름"
          type="text"
          placeholder="홍길동"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          {...register("passwordConfirm")}
        />
      </div>

      {errors.root && (
        <p className="mt-2 text-xs text-red-500">{errors.root.message}</p>
      )}

      <div className="mt-4">
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "회원가입"}
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
