import { createZodDto } from 'nestjs-zod';
import {
  createTodoSchema,
  updateTodoSchema,
  getTodosQuerySchema,
  updateRecurrenceSchema,
  updateTodoTagsSchema,
} from '@repo/schemas';

export class CreateTodoDto extends createZodDto(createTodoSchema) {}
export class UpdateTodoDto extends createZodDto(updateTodoSchema) {}
export class GetTodosRequestDto extends createZodDto(getTodosQuerySchema) {}
export class UpdateRecurrenceDto extends createZodDto(updateRecurrenceSchema) {}
export class UpdateTodoTagsDto extends createZodDto(updateTodoTagsSchema) {}
