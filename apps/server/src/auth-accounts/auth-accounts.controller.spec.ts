import { Test, TestingModule } from '@nestjs/testing';
import { AuthAccountsController } from './auth-accounts.controller';
import { AuthAccountsService } from './auth-accounts.service';

describe('AuthAccountsController', () => {
  let controller: AuthAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAccountsController],
      providers: [AuthAccountsService],
    }).compile();

    controller = module.get<AuthAccountsController>(AuthAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
