import { z } from "zod";
import { tagResponseSchema } from "../tag/tag.response.js";
import { recurrenceTypeEnum } from "./todo.request.js";

export const todoResponseSchema = z.object({
  id: z.number().int().positive().describe("할 일 ID"),
  title: z.string().describe("할 일 제목"),
  description: z.string().nullable().describe("상세 설명 (null이면 미입력)"),
  isDone: z.boolean().describe("완료 여부"),
  dueAt: z.coerce.date().nullable().describe("마감일시 (null이면 미설정)"),
  tags: z.array(tagResponseSchema).describe("연결된 태그 목록"),
  createdAt: z.coerce.date().describe("생성일시"),
  updatedAt: z.coerce.date().describe("수정일시"),
});

export const todoRecurrenceResponseSchema = z.object({
  id: z.number().int().positive().describe("할 일 ID"),
  title: z.string().describe("할 일 제목"),
  dueAt: z.coerce.date().nullable().describe("마감일시 (null이면 미설정)"),
  recurrenceType: recurrenceTypeEnum.describe("반복 유형 (none | daily | weekly | monthly | yearly)"),
  recurrenceStartAt: z.coerce.date().nullable().describe("반복 시작일 (null이면 미설정)"),
  recurrenceEndAt: z.coerce.date().nullable().describe("반복 종료일 (null이면 미설정)"),
});

export type TodoResponse = z.infer<typeof todoResponseSchema>;
export type TodoRecurrenceResponse = z.infer<typeof todoRecurrenceResponseSchema>;
