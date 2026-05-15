import { z } from "zod";
import { tagResponseSchema } from "../tag/tag.response.js";
import { recurrenceTypeEnum } from "./todo.request.js";

export const todoResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().nullable(),
  isDone: z.boolean(),
  dueAt: z.coerce.date().nullable(),
  tags: z.array(tagResponseSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const todoRecurrenceResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  dueAt: z.coerce.date().nullable(),
  recurrenceType: recurrenceTypeEnum,
  recurrenceStartAt: z.coerce.date().nullable(),
  recurrenceEndAt: z.coerce.date().nullable(),
});

export type TodoResponse = z.infer<typeof todoResponseSchema>;
export type TodoRecurrenceResponse = z.infer<typeof todoRecurrenceResponseSchema>;
