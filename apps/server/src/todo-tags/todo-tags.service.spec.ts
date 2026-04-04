import { Test, TestingModule } from '@nestjs/testing';
import { TodoTagsService } from './todo-tags.service';

describe('TodoTagsService', () => {
  let service: TodoTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoTagsService],
    }).compile();

    service = module.get<TodoTagsService>(TodoTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
