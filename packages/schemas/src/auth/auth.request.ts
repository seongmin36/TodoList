import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("유효한 이메일을 입력해주세요")
    .describe("로그인 이메일 (예: user@example.com)"),
  password: z
    .string()
    .min(6, "비밀번호는 6자 이상이어야 합니다")
    .describe("비밀번호 (6자 이상)"),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(30, "이름은 30자 이하여야 합니다")
    .describe("사용자 이름 (1~30자, 예: 홍길동)"),
  email: z
    .string()
    .email("유효한 이메일을 입력해주세요")
    .describe("이메일 주소 (예: user@example.com)"),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다")
    .describe("비밀번호 (8자 이상)"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
