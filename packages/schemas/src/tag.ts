import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "태그 이름을 입력해주세요").max(20, "태그 이름은 20자 이하여야 합니다"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "올바른 hex 색상 코드를 입력해주세요"),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
