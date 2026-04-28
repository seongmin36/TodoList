import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './dto/index';
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

  private async findTodoOrFail(
    id: number,
    userId: number,
    options: { withDeleted?: boolean } = {},
  ): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { userId: userId } },
      withDeleted: options.withDeleted,
    });

    if (!todo) {
      throw new NotFoundException(`Todo ${id}를 찾을 수 없습니다.`);
    }

    return todo;
  }

  async findAll(user: User): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { user: { userId: user.userId }, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, user: User): Promise<Todo> {
    return this.findTodoOrFail(id, user.userId);
  }

  async create(user: User, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      title: createTodoDto.title,
      description: createTodoDto.description ?? null,
      isDone: false,
      user,
    });
    return this.todosRepository.save(todo);
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    user: User,
  ): Promise<Todo> {
    const todo = await this.findTodoOrFail(id, user.userId);

    const { isDone, ...rest } = updateTodoDto;

    Object.assign(todo, rest);
    if (isDone !== undefined) todo.isDone = isDone;

    return this.todosRepository.save(todo);
  }

  async remove(id: number, user: User): Promise<void> {
    await this.findTodoOrFail(id, user.userId);
    await this.todosRepository.softDelete({ id });
  }

  async restore(id: number, user: User): Promise<Todo> {
    const todo = await this.findTodoOrFail(id, user.userId, {
      withDeleted: true,
    });
    if (!todo.deletedAt) {
      throw new BadRequestException(`이미 복원된 상태입니다.`);
    }

    await this.todosRepository.restore(id);

    todo.deletedAt = null;
    return todo;
  }
}
