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
  title: z.string().min(1, "제목을 입력해주세요").max(200),
  description: z.string().max(500).optional(),
  dueAt: z.string().optional(),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  isDone: z.boolean().optional(),
});

// 쿼리 파라미터 검증 (서버 query string → boolean 변환 포함)
export const getTodosQuerySchema = z.object({
  isDone: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  dueFrom: z.string().optional(),
  dueTo: z.string().optional(),
  recurrenceType: recurrenceTypeEnum.optional(),
  onlyRecurring: z
    .string()
    .transform((v) => v === "true")
    .optional(),
});

export const updateRecurrenceSchema = z.object({
  recurrenceType: recurrenceTypeEnum.default(RecurrenceType.NONE).optional(),
  recurrenceStartAt: z.string().optional(),
  recurrenceEndAt: z.string().optional(),
});

export const updateTodoTagsSchema = z.object({
  tagIds: z.array(z.number()),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type GetTodosQuery = z.infer<typeof getTodosQuerySchema>;
export type UpdateRecurrenceInput = z.infer<typeof updateRecurrenceSchema>;
export type UpdateTodoTagsInput = z.infer<typeof updateTodoTagsSchema>;
