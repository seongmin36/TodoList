import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthAccountsModule } from './auth-accounts/auth-accounts.module';
import { TodosModule } from './todos/todos.module';
import { TagsModule } from './tags/tags.module';
import { TodoTagsModule } from './todo-tags/todo-tags.module';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthAccountsModule,
    TodosModule,
    TagsModule,
    TodoTagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
