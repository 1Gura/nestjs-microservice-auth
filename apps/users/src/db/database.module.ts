import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';

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
      synchronize: true, // Выключить в продакшене!
    }),
    TypeOrmModule.forFeature([User]), // Подключите сущности
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
