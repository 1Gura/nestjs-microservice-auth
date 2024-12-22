import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'user_user',
      password: 'user_password',
      database: 'user_db',
      entities: [User], // Укажите сущности
      synchronize: true, // Автоматическое создание таблиц, для разработки удобно, но не рекомендуется на продакшене
    }),
    TypeOrmModule.forFeature([User]), // Подключите сущности
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
