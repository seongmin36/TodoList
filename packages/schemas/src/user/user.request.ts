import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(30)
    .optional()
    .describe("변경할 이름 (1~30자)"),
  profileImage: z
    .string()
    .optional()
    .describe("프로필 이미지 URL"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "현재 비밀번호를 입력해주세요")
    .describe("현재 비밀번호"),
  newPassword: z
    .string()
    .min(8, "새 비밀번호는 8자 이상이어야 합니다")
    .describe("새 비밀번호 (8자 이상)"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
