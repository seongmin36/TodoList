import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { AuthAccountsService } from './auth-accounts.service';
import { AuthAccountsController } from './auth-accounts.controller';
import { AuthAccount } from './entities/auth-account.entity';
import { JwtStrategy } from './jwt.strategy';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '@/configs/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthAccount]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthAccountsController],
  providers: [AuthAccountsService, JwtStrategy],
  exports: [JwtModule, PassportModule, AuthAccountsService],
})
export class AuthAccountsModule {}
