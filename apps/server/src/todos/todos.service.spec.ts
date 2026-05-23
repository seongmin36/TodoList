import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;

  const mackTodosRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  const mockTagsRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
