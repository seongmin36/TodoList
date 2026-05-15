import { z } from "zod";

export enum RecurrenceType {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export const recurrenceTypeEnum = z.nativeEnum(RecurrenceType);

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(200)
    .describe("할 일 제목 (최대 200자)"),
  description: z
    .string()
    .max(500)
    .optional()
    .describe("상세 설명 (선택, 최대 500자)"),
  dueAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("마감일 (ISO 8601, 예: 2025-05-20T09:00:00+09:00)"),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  isDone: z.boolean().optional().describe("완료 여부"),
});

export const getTodosQuerySchema = z.object({
  isDone: z
    .string()
    .transform((v) => v === "true")
    .optional()
    .describe("완료 여부 필터 (true | false)"),
  dueFrom: z
    .string()
    .optional()
    .describe("마감일 시작 범위 (ISO 8601)"),
  dueTo: z
    .string()
    .optional()
    .describe("마감일 종료 범위 (ISO 8601)"),
  recurrenceType: recurrenceTypeEnum
    .optional()
    .describe("반복 유형 필터 (none | daily | weekly | monthly | yearly)"),
  onlyRecurring: z
    .string()
    .transform((v) => v === "true")
    .optional()
    .describe("반복 할 일만 조회 (true | false)"),
});

export const updateRecurrenceSchema = z.object({
  recurrenceType: recurrenceTypeEnum
    .default(RecurrenceType.NONE)
    .optional()
    .describe("반복 유형 (기본값: none)"),
  recurrenceStartAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("반복 시작일 (ISO 8601, 예: 2025-05-01T00:00:00+09:00)"),
  recurrenceEndAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("반복 종료일 (ISO 8601, 예: 2025-12-31T23:59:59+09:00)"),
});

export const updateTodoTagsSchema = z.object({
  tagIds: z
    .array(z.number())
    .describe("적용할 태그 ID 배열 (예: [1, 2, 3])"),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type GetTodosQuery = z.infer<typeof getTodosQuerySchema>;
export type UpdateRecurrenceInput = z.infer<typeof updateRecurrenceSchema>;
export type UpdateTodoTagsInput = z.infer<typeof updateTodoTagsSchema>;
