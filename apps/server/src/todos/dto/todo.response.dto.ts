import { createZodDto } from 'nestjs-zod';
import {
  todoResponseSchema,
  todoRecurrenceResponseSchema,
} from '@repo/schemas';
import { TagResponseDto } from '@/tags/dto';
import { Todo } from '../entities/todo.entity';

export class TodoResponseDto extends createZodDto(todoResponseSchema) {
  constructor(partial: Partial<TodoResponseDto>) {
    super();
    Object.assign(this, partial);
  }

  static fromEntity(todo: Todo): TodoResponseDto {
    return new TodoResponseDto({
      id: Number(todo.id),
      title: todo.title,
      description: todo.description,
      isDone: todo.isDone,
      dueAt: todo.dueAt,
      tags: todo.tags ? TagResponseDto.fromEntities(todo.tags) : [],
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  }

  static fromEntities(todos: Todo[]): TodoResponseDto[] {
    return todos.map((todo) => TodoResponseDto.fromEntity(todo));
  }
}

export class TodoRecurrenceResponseDto extends createZodDto(
  todoRecurrenceResponseSchema,
) {
  constructor(partial: Partial<TodoRecurrenceResponseDto>) {
    super();
    Object.assign(this, partial);
  }

  static fromEntity(todo: Todo): TodoRecurrenceResponseDto {
    return new TodoRecurrenceResponseDto({
      id: Number(todo.id),
      title: todo.title,
      dueAt: todo.dueAt,
      recurrenceType: todo.recurrenceType,
      recurrenceStartAt: todo.recurrenceStartAt,
      recurrenceEndAt: todo.recurrenceEndAt,
    });
  }

  static fromEntities(todos: Todo[]): TodoRecurrenceResponseDto[] {
    return todos.map((todo) => TodoRecurrenceResponseDto.fromEntity(todo));
  }
}
