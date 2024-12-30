import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from '../../api-gateway/src/constants';
import { USER_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

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
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
