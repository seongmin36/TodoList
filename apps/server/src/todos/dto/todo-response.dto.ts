// src/todos/dto/todo-response.dto.ts
import { Todo } from '../entities/todo.entity';

export class TodoResponseDto {
  id: number;
  title: string;
  description: string | null;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(todo: Todo): TodoResponseDto {
    const dto = new TodoResponseDto();

    dto.id = todo.todos_id;
    dto.title = todo.title;
    dto.description = todo.description;
    dto.isDone = todo.is_completed;
    dto.createdAt = todo.created_at;
    dto.updatedAt = todo.updated_at;

    return dto;
  }
}
