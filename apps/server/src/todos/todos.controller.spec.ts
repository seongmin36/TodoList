import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { Tag } from '@/tags/entities/tag.entity';
import {
  mockPinoLoggerProvider,
  mockRepositoryProvider,
} from '@/test/test-providers';

describe('TodosController', () => {
  let controller: TodosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        TodosService,
        mockRepositoryProvider(Todo),
        mockRepositoryProvider(Tag),
        mockPinoLoggerProvider(TodosService.name),
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
