import { TagResponseDto } from '@/tags/dto';
import { RecurrenceType, Todo } from '../entities/todo.entity';

export class TodoResponseDto {
  id: number;
  title: string;
  description: string | null;
  isDone: boolean;
  dueAt: Date | null;
  tags: TagResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TodoResponseDto>) {
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

export class TodoRecurrenceResponseDto {
  id: number;
  title: string;
  dueAt: Date | null;
  recurrenceType: RecurrenceType;
  recurrenceStartAt: Date | null;
  recurrenceEndAt: Date | null;

  constructor(partial: Partial<TodoRecurrenceResponseDto>) {
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
