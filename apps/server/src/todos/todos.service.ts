import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  private async findTodoOrFail(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { todos_id: id, deleted_at: IsNull() },
    });

    if (!todo) {
      throw new NotFoundException(`Todo ${id}를 찾을 수 없습니다.`);
    }

    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { deleted_at: IsNull() },
    });
  }

  async findOne(id: number): Promise<Todo> {
    return this.findTodoOrFail(id);
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      title: createTodoDto.title,
      description: createTodoDto.description ?? null,
      is_completed: false,
    });
    return this.todosRepository.save(todo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findTodoOrFail(id);

    if (updateTodoDto.title !== undefined) {
      todo.title = updateTodoDto.title;
    }
    if (updateTodoDto.description !== undefined) {
      todo.description = updateTodoDto.description ?? null;
    }
    if (updateTodoDto.isDone !== undefined) {
      todo.is_completed = updateTodoDto.isDone;
    }
    return this.todosRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    await this.findTodoOrFail(id);
    await this.todosRepository.softDelete({ todos_id: id });
  }
}
