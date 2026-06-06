import { Test, TestingModule } from '@nestjs/testing';
import { AuthAccountsService } from './auth-accounts.service';
import { User } from '@/users/entities/user.entity';
import { AuthAccount } from './entities/auth-account.entity';
import {
  mockJwtServiceProvider,
  mockPinoLoggerProvider,
  mockRepositoryProvider,
} from '@/test/test-providers';

describe('AuthAccountsService', () => {
  let service: AuthAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthAccountsService,
        mockRepositoryProvider(User),
        mockRepositoryProvider(AuthAccount),
        mockJwtServiceProvider,
        mockPinoLoggerProvider(AuthAccountsService.name),
      ],
    }).compile();

    service = module.get<AuthAccountsService>(AuthAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
