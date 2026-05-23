import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTodoDto,
  TodoRecurrenceResponseDto,
  UpdateRecurrenceDto,
  UpdateTodoDto,
  UpdateTodoTagsDto,
} from './dto/index';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTodosQuery, RecurrenceType } from '@repo/schemas';
import { Todo } from './entities/todo.entity';
import {
  Between,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Tag } from '@/tags/entities/tag.entity';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { businessEvent } from '@/common/logging/structured-log.helper';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    @InjectPinoLogger(TodosService.name)
    private readonly logger: PinoLogger,
  ) {}

  private async findTodoOrFail(
    id: number,
    userId: number,
    options: { withDeleted?: boolean } = {},
  ): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { userId: userId } },
      relations: ['tags'],
      withDeleted: options.withDeleted,
    });

    if (!todo) {
      this.logger.warn(
        {
          context: 'todo',
          action: 'todo_lookup_not_found',
          user: businessEvent(userId),
          payload: { todoId: id },
        },
        '할 일을 찾을 수 없음',
      );
      throw new NotFoundException(`할 일 ${id}를 찾을 수 없습니다.`);
    }

    return todo;
  }

  async findAll(user: User, query: GetTodosQuery): Promise<Todo[]> {
    const { isDone, dueFrom, dueTo, recurrenceType, onlyRecurring } = query;

    const where: FindOptionsWhere<Todo> = {
      user: { userId: user.userId },
      deletedAt: IsNull(),
    };

    if (isDone !== undefined) {
      where.isDone = isDone;
    }

    if (dueFrom && dueTo) {
      where.dueAt = Between(new Date(dueFrom), new Date(dueTo));
    } else if (dueFrom) {
      where.dueAt = MoreThanOrEqual(new Date(dueFrom));
    } else if (dueTo) {
      where.dueAt = LessThanOrEqual(new Date(dueTo));
    }

    if (recurrenceType) {
      where.recurrenceType = recurrenceType;
    } else if (onlyRecurring === true) {
      where.recurrenceType = Not(RecurrenceType.NONE);
    }

    return this.todosRepository.find({
      where,
      relations: ['tags'],
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
      this.logger.warn(
        {
          context: 'todo',
          action: 'todo_recurrence_fetch_invalid',
          user: businessEvent(user.userId),
          payload: { todoId: id },
        },
        '반복 설정이 없는 할 일에 반복 조회 시도',
      );
      throw new BadRequestException(
        '이 할 일에는 반복 일정이 설정되어 있지 않습니다.',
      );
    }

    return TodoRecurrenceResponseDto.fromEntity(todo);
  }

  async create(user: User, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      ...createTodoDto,
      isDone: false,
      user,
    });
    const saved = await this.todosRepository.save(todo);
    this.logger.debug(
      {
        context: 'todo',
        action: 'todo_create_completed',
        user: businessEvent(user.userId),
        payload: { todoId: saved.id },
      },
      '할 일 생성 완료',
    );
    return saved;
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
    if (dueAt !== undefined) todo.dueAt = new Date(dueAt);

    const saved = await this.todosRepository.save(todo);
    this.logger.debug(
      {
        context: 'todo',
        action: 'todo_update_completed',
        user: businessEvent(user.userId),
        payload: { todoId: id },
      },
      '할 일 수정 완료',
    );
    return saved;
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

    const saved = await this.todosRepository.save(todo);
    this.logger.debug(
      {
        context: 'todo',
        action: 'todo_recurrence_update_completed',
        user: businessEvent(user.userId),
        payload: { todoId: id, recurrenceType: dto.recurrenceType },
      },
      '반복 설정 수정 완료',
    );
    return saved;
  }

  async updateTags(
    id: number,
    user: User,
    dto: UpdateTodoTagsDto,
  ): Promise<Todo> {
    const { tagIds } = dto;

    const todo = await this.findTodoOrFail(id, user.userId);

    let tags: Tag[] = [];
    if (tagIds.length > 0) {
      tags = await this.tagsRepository.find({
        where: {
          id: In(tagIds),
          user: { userId: user.userId },
        },
      });
    }

    if (tags.length !== tagIds.length) {
      this.logger.warn(
        {
          context: 'todo',
          action: 'todo_tags_update_invalid_ids',
          user: businessEvent(user.userId),
          payload: { todoId: id, requestedTagIds: tagIds },
        },
        '존재하지 않는 태그 ID 포함',
      );
      throw new BadRequestException(
        '존재하지 않는 태그 ID가 포함되어 있습니다.',
      );
    }

    todo.tags = tags;
    const saved = await this.todosRepository.save(todo);
    this.logger.debug(
      {
        context: 'todo',
        action: 'todo_tags_update_completed',
        user: businessEvent(user.userId),
        payload: { todoId: id, tagCount: tags.length },
      },
      '할 일 태그 수정 완료',
    );
    return saved;
  }

  async remove(id: number, user: User): Promise<void> {
    await this.findTodoOrFail(id, user.userId);
    await this.todosRepository.softDelete({ id });
    this.logger.debug(
      {
        context: 'todo',
        action: 'todo_soft_delete_completed',
        user: businessEvent(user.userId),
        payload: { todoId: id },
      },
      '할 일 삭제 완료',
    );
  }

  async restore(id: number, user: User): Promise<Todo> {
    const todo = await this.findTodoOrFail(id, user.userId, {
      withDeleted: true,
    });
    if (!todo.deletedAt) {
      this.logger.warn(
        {
          context: 'todo',
          action: 'todo_restore_already_active',
          user: businessEvent(user.userId),
          payload: { todoId: id },
        },
        '이미 복원된 할 일 복원 시도',
      );
      throw new BadRequestException(`이미 복원된 상태입니다.`);
    }

    await this.todosRepository.restore(id);
    this.logger.debug(
      {
        context: 'todo',
        action: 'todo_restore_completed',
        user: businessEvent(user.userId),
        payload: { todoId: id },
      },
      '할 일 복원 완료',
    );

    todo.deletedAt = null;
    return todo;
  }
}
