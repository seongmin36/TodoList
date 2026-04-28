import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { TodoResponseDto } from './dto/todo.response.dto';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(
    @GetUser() user: User,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.create(user, createTodoDto);
    return TodoResponseDto.fromEntity(todo);
  }

  @Get()
  async findAll(): Promise<TodoResponseDto[]> {
    const todos = await this.todosService.findAll();
    return TodoResponseDto.fromEntities(todos);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.findOne(id);
    return TodoResponseDto.fromEntity(todo);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    const todo = await this.todosService.update(id, updateTodoDto);
    return TodoResponseDto.fromEntity(todo);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todosService.remove(id);
  }
}
