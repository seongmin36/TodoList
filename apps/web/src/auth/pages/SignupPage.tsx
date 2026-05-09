import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { signupSchema, type SignupInput } from "@repo/schemas";
import { AuthTabSwitch } from "@/auth/components/AuthTabSwitch";
import { Button } from "@/shared/components/Button";
import { Divider } from "@/shared/components/Divider";
import { Input } from "@/shared/components/Input";
import { ROUTES } from "@/routes";

export default function SignupPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (_data: SignupInput) => {
    // TODO: 회원가입 API 연동
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col px-10 pt-[4.859rem]"
    >
      <AuthTabSwitch
        activeTab="signup"
        onChange={(tab) => {
          if (tab === "login") navigate(ROUTES.LOGIN);
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

      <div className="mt-4">
        <Button type="submit" fullWidth>
          회원가입
        </Button>
      </div>

      <div className="mt-3.5">
        <Divider />
      </div>

      <div className="mt-3.5">
        <Button variant="outline" fullWidth>
          <span className="flex items-center justify-center gap-2">
            <span className="font-bold text-sm">G</span>
            <span>Google로 로그인</span>
          </span>
        </Button>
      </div>
    </form>
  );
}
