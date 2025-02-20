import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from '../constants';
import { USER_PACKAGE_NAME } from '@app/common';
import { join } from 'path';
import { FileController } from './files.controller';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    DatabaseModule,
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
  providers: [FilesService],
  controllers: [FileController],
})
export class FilesModule {}
