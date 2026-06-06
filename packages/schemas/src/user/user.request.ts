import { z } from "zod";
import { withXssCheck } from "../security/xss.js";

export const updateProfileSchema = z.object({
  name: withXssCheck(z.string().min(1).max(30))
    .optional()
    .describe("변경할 이름 (1~30자)"),
  profileImage: withXssCheck(z.string())
    .optional()
    .describe("프로필 이미지 URL"),
});

export const changePasswordSchema = z.object({
  currentPassword: withXssCheck(
    z.string().min(1, "현재 비밀번호를 입력해주세요"),
  ).describe("현재 비밀번호"),
  newPassword: withXssCheck(
    z.string().min(8, "새 비밀번호는 8자 이상이어야 합니다"),
  ).describe("새 비밀번호 (8자 이상)"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
