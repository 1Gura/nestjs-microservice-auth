import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from './db/database.module';
import { PostService } from './post/post.service';

@Module({
  imports: [
    DatabaseModule, // Ваш модуль базы данных
  ],
  controllers: [UsersController],
  providers: [UsersService, PostService],
  exports: [UsersService],
})
export class UsersModule {}
