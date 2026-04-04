import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { jwtSecret } from '@/configs/jwt.config';
import { AuthAccountsService } from './auth-accounts.service';
import { AuthAccountsController } from './auth-accounts.controller';
import { AuthAccount } from './entities/auth-account.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthAccount]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthAccountsController],
  providers: [AuthAccountsService, JwtStrategy],
  exports: [JwtModule, PassportModule, AuthAccountsService],
})
export class AuthAccountsModule {}
