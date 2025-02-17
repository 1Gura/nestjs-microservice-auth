import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreatePostRequest,
  DeletePostRequest,
  GetPostRequest,
  ListPostsRequest,
  UpdatePostRequest,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { USER_SERVICE } from '../constants';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class PostsService implements OnModuleInit {
  // TODO костыль тк не могу делать больше микросервисом. Закончилась оперативка :(
  private usersServiceClient: UsersServiceClient;

  constructor(@Inject(USER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersServiceClient =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  create(request: CreatePostRequest) {
    return this.usersServiceClient.createPost(request);
  }

  findAll(request: ListPostsRequest) {
    return this.usersServiceClient.listPosts(request);
  }

  findOne(request: GetPostRequest) {
    return this.usersServiceClient.getPost(request);
  }

  update(request: UpdatePostRequest) {
    return this.usersServiceClient.updatePost(request);
  }

  remove(request: DeletePostRequest) {
    return this.usersServiceClient.deletePost(request);
  }
}
