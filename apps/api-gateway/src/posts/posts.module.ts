import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from '../constants';
import { USER_PACKAGE_NAME } from '@app/common';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
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
  controllers: [PostsController],
  providers: [PostsService, JwtService, Reflector],
})
export class PostsModule {}
