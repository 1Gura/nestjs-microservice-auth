import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from '../../api-gateway/src/constants';
import { USER_PACKAGE_NAME } from '@app/common';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './db/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

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
        RefreshToken,
      ],
      synchronize: true, // Включите для разработки, для продакшн выключите
    }),
    TypeOrmModule.forFeature([RefreshToken]), // Подключите сущности
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../user.proto'),
          url: 'localhost:3002', // gRPC-сервер users
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret', // Укажите секретный ключ
      signOptions: { expiresIn: '1h' }, // Настройте опционально время жизни токена
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService],
  exports: [AuthService],
})
export class AuthModule {}
