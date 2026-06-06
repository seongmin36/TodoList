import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthAccountsModule } from './auth-accounts/auth-accounts.module';
import { TodosModule } from './todos/todos.module';
import { TagsModule } from './tags/tags.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './configs/jwt.config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth-accounts/guards/jwt-auth.guard';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage, ServerResponse } from 'http';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      load: [jwtConfig],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        // pino-pretty는 devDependency — development에서만 사용 (prod 이미지에 없음)
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:HH:MM:ss.l',
                  ignore: 'pid,hostname,req,res,responseTime',
                },
              }
            : undefined,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        // 로그에서 제외할 경로 (헬스체크 등)
        autoLogging: {
          ignore: (req) => req.url === '/health',
        },
        // 로그 자체에 메인 텍스트 스트림을 커스텀 바 형태로 명시
        customSuccessMessage: (req, res, responseTime) => {
          return `[HTTP] ${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms)`;
        },
        customErrorMessage: (req, res, err) => {
          return `[HTTP ERROR] ${req.method} ${req.url} - ${res.statusCode} | ${err.message}`;
        },
        // 응답에서 민감 정보 제거
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        serializers: {
          req(req: IncomingMessage & { id?: string }) {
            return { method: req.method, url: req.url, id: req.id };
          },
          res(res: ServerResponse) {
            return { statusCode: res.statusCode };
          },
        },
      },
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
    AuthAccountsModule,
    TodosModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
