import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(30).optional(),
  profileImage: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z.string().min(8, "새 비밀번호는 8자 이상이어야 합니다"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
