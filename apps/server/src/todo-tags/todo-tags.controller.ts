import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoTagsService } from './todo-tags.service';
import { CreateTodoTagDto } from './dto/create-todo-tag.dto';
import { UpdateTodoTagDto } from './dto/update-todo-tag.dto';

@Controller('todo-tags')
export class TodoTagsController {
  constructor(private readonly todoTagsService: TodoTagsService) {}

  @Post()
  create(@Body() createTodoTagDto: CreateTodoTagDto) {
    return this.todoTagsService.create(createTodoTagDto);
  }

  @Get()
  findAll() {
    return this.todoTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoTagDto: UpdateTodoTagDto) {
    return this.todoTagsService.update(+id, updateTodoTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoTagsService.remove(+id);
  }
}
