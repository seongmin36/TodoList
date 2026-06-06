import { z } from "zod";
import {
  withXssCheck,
  xssSafeIsoDateTimeString,
  xssSafeBooleanFromQueryString,
} from "../security/xss.js";

export enum RecurrenceType {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export const recurrenceTypeEnum = z.nativeEnum(RecurrenceType);

export const createTodoSchema = z.object({
  title: withXssCheck(
    z.string().min(1, "제목을 입력해주세요").max(200),
  ).describe("할 일 제목 (최대 200자)"),
  description: withXssCheck(z.string().max(500))
    .optional()
    .describe("상세 설명 (선택, 최대 500자)"),
  dueAt: xssSafeIsoDateTimeString()
    .optional()
    .describe("마감일 (ISO 8601, 예: 2025-05-20T09:00:00+09:00)"),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  isDone: z.boolean().optional().describe("완료 여부"),
});

export const getTodosQuerySchema = z
  .object({
    isDone: xssSafeBooleanFromQueryString()
      .optional()
      .describe("완료 여부 필터 (true | false)"),
    dueFrom: xssSafeIsoDateTimeString()
      .optional()
      .describe("마감일 시작 범위 (ISO 8601)"),
    dueTo: xssSafeIsoDateTimeString()
      .optional()
      .describe("마감일 종료 범위 (ISO 8601)"),
    recurrenceType: recurrenceTypeEnum
      .optional()
      .describe("반복 유형 필터 (none | daily | weekly | monthly | yearly)"),
    onlyRecurring: xssSafeBooleanFromQueryString()
      .optional()
      .describe("반복 할 일만 조회 (true | false)"),
  })
  .refine(
    (data) => {
      if (data.dueFrom && data.dueTo) {
        return new Date(data.dueFrom) <= new Date(data.dueTo);
      }
      return true;
    },
    {
      message: "dueFrom은 dueTo보다 이전이어야 합니다.",
      path: ["dueFrom"],
    },
  );

export const updateRecurrenceSchema = z.object({
  recurrenceType: recurrenceTypeEnum
    .default(RecurrenceType.NONE)
    .optional()
    .describe("반복 유형 (기본값: none)"),
  recurrenceStartAt: xssSafeIsoDateTimeString()
    .optional()
    .describe("반복 시작일 (ISO 8601, 예: 2025-05-01T00:00:00+09:00)"),
  recurrenceEndAt: xssSafeIsoDateTimeString()
    .optional()
    .describe("반복 종료일 (ISO 8601, 예: 2025-12-31T23:59:59+09:00)"),
});

export const updateTodoTagsSchema = z.object({
  tagIds: z.array(z.number()).describe("적용할 태그 ID 배열 (예: [1, 2, 3])"),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type GetTodosQuery = z.infer<typeof getTodosQuerySchema>;
export type UpdateRecurrenceInput = z.infer<typeof updateRecurrenceSchema>;
export type UpdateTodoTagsInput = z.infer<typeof updateTodoTagsSchema>;
