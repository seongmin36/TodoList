import { z } from "zod";

// API 계약 스키마 (서버 + 클라이언트 공용)
export const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(30, "이름은 30자 이하여야 합니다"),
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});

// 프론트엔드 폼 전용 스키마
export const signupFormSchema = signupSchema
  .extend({ passwordConfirm: z.string() })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z.string().min(8, "새 비밀번호는 8자 이상이어야 합니다"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SignupFormInput = z.infer<typeof signupFormSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
