import { z } from "zod";

export const tagResponseSchema = z.object({
  id: z.number().int().positive().describe("태그 ID"),
  name: z.string().describe("태그 이름"),
  color: z.string().nullable().describe("태그 색상 (hex, null이면 기본 색상 적용)"),
  createdAt: z.coerce.date().describe("생성일시"),
  updatedAt: z.coerce.date().describe("수정일시"),
});

export type TagResponse = z.infer<typeof tagResponseSchema>;
