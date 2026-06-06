import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import {
  mockPinoLoggerProvider,
  mockRepositoryProvider,
} from '@/test/test-providers';

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        mockRepositoryProvider(Tag),
        mockPinoLoggerProvider(TagsService.name),
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
