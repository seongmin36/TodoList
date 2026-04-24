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

    dto.id = todo.id;
    dto.title = todo.title;
    dto.description = todo.description;
    dto.isDone = todo.isCompleted;
    dto.createdAt = todo.createdAt;
    dto.updatedAt = todo.updatedAt;

    return dto;
  }

  static fromEntities(todos: Todo[]): TodoResponseDto[] {
    return todos.map((todo) => TodoResponseDto.fromEntity(todo));
  }
}
