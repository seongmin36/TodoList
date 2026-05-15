import { z } from "zod";

export const userProfileSchema = z.object({
  userId: z.number().int().positive().describe("사용자 ID"),
  name: z.string().describe("사용자 이름"),
  profileImage: z.string().nullable().describe("프로필 이미지 URL (null이면 미설정)"),
  isActive: z.boolean().describe("계정 활성화 여부"),
  createdAt: z.coerce.date().describe("가입일시"),
  updatedAt: z.coerce.date().describe("수정일시"),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
