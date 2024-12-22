import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env', // Укажи путь к `.env` для микросервиса
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'postgres',
        password: '1234',
        database: 'users_db',
        autoLoadEntities: true,
        synchronize: true, // Выключить в продакшене!
      }),
    }),
  ],
})
export class DatabaseModule {}
