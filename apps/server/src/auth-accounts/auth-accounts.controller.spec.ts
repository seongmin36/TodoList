import { Test, TestingModule } from '@nestjs/testing';
import { AuthAccountsController } from './auth-accounts.controller';
import { AuthAccountsService } from './auth-accounts.service';
import { User } from '@/users/entities/user.entity';
import { AuthAccount } from './entities/auth-account.entity';
import {
  mockJwtServiceProvider,
  mockPinoLoggerProvider,
  mockRepositoryProvider,
} from '@/test/test-providers';

describe('AuthAccountsController', () => {
  let controller: AuthAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAccountsController],
      providers: [
        AuthAccountsService,
        mockRepositoryProvider(User),
        mockRepositoryProvider(AuthAccount),
        mockJwtServiceProvider,
        mockPinoLoggerProvider(AuthAccountsService.name),
      ],
    }).compile();

    controller = module.get<AuthAccountsController>(AuthAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
