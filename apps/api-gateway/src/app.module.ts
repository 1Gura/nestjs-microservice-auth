import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [UsersModule, AuthModule, PostsModule, FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
