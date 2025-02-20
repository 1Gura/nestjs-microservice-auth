import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, Post, Tag, User } from '../../../../users/src/db/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'user_user',
      password: 'user_password',
      database: 'user_db',
      entities: [Post, File, User, Tag], // Укажите сущности
      synchronize: true, // Выключить в продакшене!
    }),
    TypeOrmModule.forFeature([Post, File, User, Tag]), // Подключите сущности
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
