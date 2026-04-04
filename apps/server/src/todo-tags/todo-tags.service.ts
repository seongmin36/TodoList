import { Injectable } from '@nestjs/common';
import { CreateTodoTagDto } from './dto/create-todo-tag.dto';
import { UpdateTodoTagDto } from './dto/update-todo-tag.dto';

@Injectable()
export class TodoTagsService {
  create(createTodoTagDto: CreateTodoTagDto) {
    return 'This action adds a new todoTag';
  }

  findAll() {
    return `This action returns all todoTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todoTag`;
  }

  update(id: number, updateTodoTagDto: UpdateTodoTagDto) {
    return `This action updates a #${id} todoTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} todoTag`;
  }
}
