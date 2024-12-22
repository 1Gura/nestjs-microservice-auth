import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // Порт контейнера для авторизации
      username: 'auth_user',
      password: 'auth_password',
      database: 'auth_db',
      entities: [
        // Добавьте свои сущности для авторизации
        // AuthEntity,
      ],
      synchronize: true, // Включите для разработки, для продакшн выключите
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
