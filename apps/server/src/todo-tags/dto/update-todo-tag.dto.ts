import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoTagDto } from './create-todo-tag.dto';

export class UpdateTodoTagDto extends PartialType(CreateTodoTagDto) {}
