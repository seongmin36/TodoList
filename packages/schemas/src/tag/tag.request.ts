import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "태그 이름을 입력해주세요")
    .max(50, "태그 이름은 50자 이하여야 합니다")
    .describe("태그 이름 (1~50자, 예: 업무)"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "올바른 hex 색상 코드를 입력해주세요")
    .optional()
    .describe("태그 색상 (hex 코드, 예: #4a90d9)"),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
