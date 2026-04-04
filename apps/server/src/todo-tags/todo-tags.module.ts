import { Module } from '@nestjs/common';
import { TodoTagsService } from './todo-tags.service';
import { TodoTagsController } from './todo-tags.controller';

@Module({
  controllers: [TodoTagsController],
  providers: [TodoTagsService],
})
export class TodoTagsModule {}
