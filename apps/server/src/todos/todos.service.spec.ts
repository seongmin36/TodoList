import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { Tag } from '@/tags/entities/tag.entity';
import {
  mockPinoLoggerProvider,
  mockRepositoryProvider,
} from '@/test/test-providers';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        mockRepositoryProvider(Todo),
        mockRepositoryProvider(Tag),
        mockPinoLoggerProvider(TodosService.name),
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
