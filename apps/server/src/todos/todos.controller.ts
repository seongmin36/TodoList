import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
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
  TodoWithTagsResponseDto,
} from './dto/todo.response.dto';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import { JwtAuthGuard } from '@/auth-accounts/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAll(
    @GetUser() user: User,
    @Query() query: GetTodosRequestDto,
  ): Promise<TodoWithTagsResponseDto[]> {
    const todos = await this.todosService.findAll(user, query);
    return todos.map((todo) => TodoWithTagsResponseDto.fromEntity(todo));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TodoWithTagsResponseDto> {
    const todo = await this.todosService.findOne(id, user);
    return TodoWithTagsResponseDto.fromEntity(todo);
  }

  @Get(':id/recurrence')
  async getRecurrence(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TodoRecurrenceResponseDto> {
    return this.todosService.getRecurrence(id, user);
  }

  @Get('recurring/today')
  async getTodayRecurrences(
    @GetUser() user: User,
  ): Promise<TodoRecurrenceResponseDto[]> {
    const todos = await this.todosService.findTodayRecurring(user);
    return TodoRecurrenceResponseDto.fromEntities(todos);
  }

  @Post()
  async create(
    @GetUser() user: User,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.create(user, createTodoDto);
    return TodoResponseDto.fromEntity(todo);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @GetUser() user: User,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.update(id, updateTodoDto, user);
    return TodoResponseDto.fromEntity(todo);
  }

  @Patch(':id/restore')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.restore(id, user);
    return TodoResponseDto.fromEntity(todo);
  }

  @Patch(':id/recurrence')
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
  async updateTags(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() updateTodoTagsDto: UpdateTodoTagsDto,
  ): Promise<TodoWithTagsResponseDto> {
    const updatedTodo = await this.todosService.updateTags(
      id,
      user,
      updateTodoTagsDto,
    );
    return TodoWithTagsResponseDto.fromEntity(updatedTodo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.todosService.remove(id, user);
  }
}
