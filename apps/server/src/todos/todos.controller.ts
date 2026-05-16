import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import {
  CreateTodoDto,
  GetTodosRequestDto,
  UpdateRecurrenceDto,
  UpdateTodoDto,
  UpdateTodoTagsDto,
} from './dto';
import {
  TodoRecurrenceResponseDto,
  TodoResponseDto,
} from './dto/todo.response.dto';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('todos')
@ApiCookieAuth('access_token')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({
    summary: '할 일 목록 조회',
    description: '필터 조건에 따라 할 일 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'isDone',
    required: false,
    description: '완료 여부 필터',
    example: 'true',
  })
  @ApiQuery({
    name: 'dueTo',
    required: false,
    description: '마감일 종료 범위 (ISO 8601)',
    example: '2025-05-31T23:59:59+09:00',
  })
  @ApiQuery({
    name: 'recurrenceType',
    required: false,
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
    description: '반복 유형 필터',
  })
  @ApiQuery({
    name: 'onlyRecurring',
    required: false,
    description: '반복 할 일만 조회',
    example: 'false',
  })
  @ApiOkResponse({
    description: '할 일 목록 조회 성공',
    type: TodoResponseDto,
    isArray: true,
    schema: {
      example: [
        {
          id: 1,
          title: 'NestJS 공부하기',
          description: 'Module, Controller, Service 구조 이해하기',
          isDone: false,
          dueAt: '2026-03-30T09:00:00.000Z',
          tags: [],
          createdAt: '2026-03-28T09:00:00.000Z',
          updatedAt: '2026-03-28T09:00:00.000Z',
        },
        {
          id: 2,
          title: 'ERD 설계',
          description: null,
          isDone: true,
          dueAt: null,
          tags: [],
          createdAt: '2026-03-27T14:00:00.000Z',
          updatedAt: '2026-03-28T10:30:00.000Z',
        },
      ],
    },
  })
  async findAll(
    @GetUser() user: User,
    @Query() query: GetTodosRequestDto,
  ): Promise<TodoResponseDto[]> {
    const todos = await this.todosService.findAll(user, query);
    return TodoResponseDto.fromEntities(todos);
  }

  @Get(':id')
  @ApiOperation({
    summary: '할 일 단건 조회',
    description: 'ID로 할 일을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 ID',
    example: 1,
  })
  @ApiOkResponse({
    description: '할 일 조회 성공',
    type: TodoResponseDto,
    schema: {
      example: {
        id: 1,
        title: 'NestJS 공부하기',
        description: 'Module, Controller, Service 구조 이해하기',
        isDone: false,
        dueAt: '2026-03-30T09:00:00.000Z',
        tags: [],
        createdAt: '2026-03-28T09:00:00.000Z',
        updatedAt: '2026-03-28T09:00:00.000Z',
      },
    },
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.findOne(id, user);
    return TodoResponseDto.fromEntity(todo);
  }

  @Get(':id/recurrence')
  @ApiOperation({
    summary: '반복 설정 조회',
    description: '특정 할 일의 반복 설정을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 ID',
    example: 1,
  })
  @ApiOkResponse({
    description: '반복 설정 조회 성공',
    type: TodoRecurrenceResponseDto,
    schema: {
      example: {
        id: 1,
        title: '운동하기',
        dueAt: '2026-03-30T09:00:00.000Z',
        recurrenceType: 'weekly',
        recurrenceStartAt: '2026-03-01T00:00:00.000Z',
        recurrenceEndAt: '2026-12-31T23:59:59.000Z',
      },
    },
  })
  async getRecurrence(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TodoRecurrenceResponseDto> {
    return this.todosService.getRecurrence(id, user);
  }

  @Get('recurring/today')
  @ApiOperation({
    summary: '오늘 반복 할 일 조회',
    description: '오늘 기준 반복 대상인 할 일 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '오늘 반복 할 일 조회 성공',
    type: TodoRecurrenceResponseDto,
    isArray: true,
    schema: {
      example: [
        {
          id: 1,
          title: '운동하기',
          dueAt: '2026-03-30T09:00:00.000Z',
          recurrenceType: 'daily',
          recurrenceStartAt: '2026-03-01T00:00:00.000Z',
          recurrenceEndAt: null,
        },
      ],
    },
  })
  async getTodayRecurrences(
    @GetUser() user: User,
  ): Promise<TodoRecurrenceResponseDto[]> {
    const todos = await this.todosService.findTodayRecurring(user);
    return TodoRecurrenceResponseDto.fromEntities(todos);
  }

  @Post()
  @ApiOperation({
    summary: '할 일 생성',
    description: '새로운 할 일을 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '할 일 생성 성공',
    type: TodoResponseDto,
    schema: {
      example: {
        id: 3,
        title: 'API 문서 작성',
        description: 'Swagger 예시 추가하기',
        isDone: false,
        dueAt: '2026-04-01T09:00:00.000Z',
        tags: [],
        createdAt: '2026-03-29T09:00:00.000Z',
        updatedAt: '2026-03-29T09:00:00.000Z',
      },
    },
  })
  async create(
    @GetUser() user: User,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.create(user, createTodoDto);
    return TodoResponseDto.fromEntity(todo);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '할 일 수정',
    description: '할 일의 제목, 설명, 상태 등을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 ID',
    example: 1,
  })
  @ApiOkResponse({
    description: '할 일 수정 성공',
    type: TodoResponseDto,
    schema: {
      example: {
        id: 1,
        title: 'NestJS 공부하기',
        description: 'Controller와 Swagger 문서까지 정리하기',
        isDone: true,
        dueAt: '2026-03-30T09:00:00.000Z',
        tags: [],
        createdAt: '2026-03-28T09:00:00.000Z',
        updatedAt: '2026-03-29T12:00:00.000Z',
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @GetUser() user: User,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.update(id, updateTodoDto, user);
    return TodoResponseDto.fromEntity(todo);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: '할 일 복원',
    description: '삭제된 할 일을 복원합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 ID',
    example: 1,
  })
  @ApiOkResponse({
    description: '할 일 복원 성공',
    type: TodoResponseDto,
    schema: {
      example: {
        id: 1,
        title: 'NestJS 공부하기',
        description: 'Controller와 Swagger 문서까지 정리하기',
        isDone: false,
        dueAt: '2026-03-30T09:00:00.000Z',
        tags: [],
        createdAt: '2026-03-28T09:00:00.000Z',
        updatedAt: '2026-03-29T12:00:00.000Z',
      },
    },
  })
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.restore(id, user);
    return TodoResponseDto.fromEntity(todo);
  }

  @Patch(':id/recurrence')
  @ApiOperation({
    summary: '반복 설정 수정',
    description: '할 일의 반복 설정을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 ID',
    example: 1,
  })
  @ApiOkResponse({
    description: '반복 설정 수정 성공',
    type: TodoRecurrenceResponseDto,
    schema: {
      example: {
        id: 1,
        title: '운동하기',
        dueAt: '2026-03-30T09:00:00.000Z',
        recurrenceType: 'weekly',
        recurrenceStartAt: '2026-03-01T00:00:00.000Z',
        recurrenceEndAt: '2026-12-31T23:59:59.000Z',
      },
    },
  })
  async updateRecurrence(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() updateRecurrenceDto: UpdateRecurrenceDto,
  ): Promise<TodoRecurrenceResponseDto> {
    const updatedTodo = await this.todosService.updateRecurrence(
      id,
      user,
      updateRecurrenceDto,
    );
    return TodoRecurrenceResponseDto.fromEntity(updatedTodo);
  }

  @Patch(':id/tags')
  @ApiOperation({
    summary: '할 일 태그 수정',
    description: '할 일에 연결된 태그 목록을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 ID',
    example: 1,
  })
  @ApiOkResponse({
    description: '할 일 태그 수정 성공',
    type: TodoResponseDto,
    schema: {
      example: {
        id: 1,
        title: 'NestJS 공부하기',
        description: 'Swagger 문서 정리',
        isDone: false,
        dueAt: '2026-03-30T09:00:00.000Z',
        tags: [
          { id: 1, name: 'backend' },
          { id: 2, name: 'nestjs' },
        ],
        createdAt: '2026-03-28T09:00:00.000Z',
        updatedAt: '2026-03-29T12:00:00.000Z',
      },
    },
  })
  async updateTags(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() updateTodoTagsDto: UpdateTodoTagsDto,
  ): Promise<TodoResponseDto> {
    const updatedTodo = await this.todosService.updateTags(
      id,
      user,
      updateTodoTagsDto,
    );
    return TodoResponseDto.fromEntity(updatedTodo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '할 일 삭제',
    description: '할 일을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 ID',
    example: 1,
  })
  async remove(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.todosService.remove(id, user);
  }
}
