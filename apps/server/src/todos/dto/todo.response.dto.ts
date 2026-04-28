import { Todo } from '../entities/todo.entity';

export class TodoResponseDto {
  id: number;
  title: string;
  description: string | null;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TodoResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(todo: Todo): TodoResponseDto {
    return new TodoResponseDto({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isDone: todo.isDone,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  }

  static fromEntities(todos: Todo[]): TodoResponseDto[] {
    return todos.map((todo) => TodoResponseDto.fromEntity(todo));
  }
}
