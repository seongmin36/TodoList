import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTodoDto,
  GetTodosRequestDto,
  TodoRecurrenceResponseDto,
  UpdateRecurrenceDto,
  UpdateTodoDto,
} from './dto/index';
import { InjectRepository } from '@nestjs/typeorm';
import { RecurrenceType, Todo } from './entities/todo.entity';
import {
  Between,
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
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

  async findAll(user: User, query: GetTodosRequestDto): Promise<Todo[]> {
    const { isDone, dueFrom, dueTo, recurrenceType, onlyRecurring } = query;

    const where: FindOptionsWhere<Todo> = {
      user: { userId: user.userId },
      deletedAt: IsNull(),
    };

    if (isDone !== undefined) {
      where.isDone = isDone;
    }

    if (dueFrom && dueTo) {
      where.dueAt = Between(dueFrom, dueTo);
    } else if (dueFrom) {
      where.dueAt = MoreThanOrEqual(dueFrom);
    } else if (dueTo) {
      where.dueAt = LessThanOrEqual(dueTo);
    }

    if (recurrenceType) {
      where.recurrenceType = recurrenceType;
    } else if (onlyRecurring === true) {
      where.recurrenceType = Not(RecurrenceType.NONE);
    }

    console.log('받은 쿼리:', query);

    return this.todosRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, user: User): Promise<Todo> {
    return this.findTodoOrFail(id, user.userId);
  }

  async findTodayRecurring(user: User): Promise<Todo[]> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const baseCondition = {
      user: { userId: user.userId },
      deletedAt: IsNull(),
      recurrenceType: Not(RecurrenceType.NONE),
      recurrenceStartAt: LessThanOrEqual(todayEnd),
    };

    return this.todosRepository.find({
      where: [
        { ...baseCondition, recurrenceEndAt: IsNull() },
        { ...baseCondition, recurrenceEndAt: MoreThanOrEqual(todayStart) },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getRecurrence(
    id: number,
    user: User,
  ): Promise<TodoRecurrenceResponseDto> {
    const todo = await this.findTodoOrFail(id, user.userId);

    if (todo.recurrenceType === RecurrenceType.NONE) {
      throw new BadRequestException(`Recurrence not found for todo ${id}`);
    }

    return TodoRecurrenceResponseDto.fromEntity(todo);
  }

  async create(user: User, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      ...createTodoDto,
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

    const { isDone, dueAt, ...rest } = updateTodoDto;

    Object.assign(todo, rest);
    if (isDone !== undefined) {
      todo.isDone = isDone;
      todo.completedAt = isDone ? new Date() : null;
    }
    if (dueAt !== undefined) todo.dueAt = dueAt;

    return this.todosRepository.save(todo);
  }

  async updateRecurrence(
    id: number,
    user: User,
    dto: UpdateRecurrenceDto,
  ): Promise<Todo> {
    const todo = await this.findTodoOrFail(id, user.userId);

    Object.assign(todo, dto);

    if (dto.recurrenceType === RecurrenceType.NONE) {
      todo.recurrenceStartAt = null;
      todo.recurrenceEndAt = null;
    }

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
