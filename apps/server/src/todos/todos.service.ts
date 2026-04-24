import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  private async findTodoOrFail(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!todo) {
      throw new NotFoundException(`Todo ${id}를 찾을 수 없습니다.`);
    }

    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: number): Promise<Todo> {
    return this.findTodoOrFail(id);
  }

  async create(user: User, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      title: createTodoDto.title,
      description: createTodoDto.description ?? null,
      isCompleted: false,
      user,
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
      todo.isCompleted = updateTodoDto.isDone;
    }
    return this.todosRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    await this.findTodoOrFail(id);
    await this.todosRepository.softDelete({ id });
  }
}
