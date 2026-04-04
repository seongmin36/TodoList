import { Module } from '@nestjs/common';
import { AuthAccountsService } from './auth-accounts.service';
import { AuthAccountsController } from './auth-accounts.controller';

@Module({
  controllers: [AuthAccountsController],
  providers: [AuthAccountsService],
})
export class AuthAccountsModule {}
