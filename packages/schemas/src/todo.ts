import { z } from "zod";

export const recurringEnum = z.enum(["없음", "매일", "매주", "매월"]);

export const createTodoSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  recurring: recurringEnum.default("없음"),
  tagIds: z.array(z.number()).optional(),
});

export const updateTodoSchema = createTodoSchema.partial();

export type RecurringType = z.infer<typeof recurringEnum>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
