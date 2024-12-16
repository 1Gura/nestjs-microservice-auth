import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth', // Название пакета в .proto файле
        protoPath: join(__dirname, '../auth.proto'), // Путь к .proto файлу
        url: 'localhost:5000', // gRPC-сервер будет слушать на этом порту
      },
    },
  );
  await app.listen();
}
bootstrap();
