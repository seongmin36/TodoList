import { Test, TestingModule } from '@nestjs/testing';
import { TodoTagsController } from './todo-tags.controller';
import { TodoTagsService } from './todo-tags.service';

describe('TodoTagsController', () => {
  let controller: TodoTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoTagsController],
      providers: [TodoTagsService],
    }).compile();

    controller = module.get<TodoTagsController>(TodoTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
