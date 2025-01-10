import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@app/common';
import { UsersModule } from './users.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../user.proto'),
        package: USER_PACKAGE_NAME,
        url: 'localhost:3002', // gRPC-сервер будет слушать на этом порту
      },
    },
  );
  await app.listen();
}
bootstrap();
