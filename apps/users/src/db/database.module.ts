import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, Post, Tag, User } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'user_user',
      password: 'user_password',
      database: 'user_db',
      entities: [User, Post, Tag, File], // Укажите сущности
      synchronize: true, // Выключить в продакшене!
    }),
    TypeOrmModule.forFeature([User, Post, Tag, File]), // Подключите сущности
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
