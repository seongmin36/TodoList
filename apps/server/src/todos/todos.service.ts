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

  create(createTodoDto: CreateTodoDto) {
    return 'This action adds a new todo';
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
