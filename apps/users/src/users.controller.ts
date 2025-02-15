import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreatePostRequest,
  CreateUserDto,
  DeletePostRequest,
  Empty,
  FindOneUserDto,
  GetPostRequest,
  ListPostsRequest,
  ListPostsResponse,
  PostResponse,
  UpdatePostRequest,
  UpdateUserDto,
  User,
  UsersServiceController,
  UsersServiceControllerMethods,
} from '@app/common';
import { PostService } from './post/post.service';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postService: PostService,
  ) {}

  async createPost(request: CreatePostRequest): Promise<PostResponse> {
    return this.postService.createPost(request);
  }
  async getPost(request: GetPostRequest): Promise<PostResponse> {
    return this.postService.getPost(request.id);
  }
  async listPosts(request: ListPostsRequest): Promise<ListPostsResponse> {
    return { posts: await this.postService.listPosts(request) };
  }
  async updatePost(request: UpdatePostRequest): Promise<PostResponse> {
    return this.postService.updatePost(request);
  }
  async deletePost(request: DeletePostRequest): Promise<Empty> {
    await this.postService.deletePost(request.id);
    return {};
  }

  createUser(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAll();
  }

  async findOneUser(request: FindOneUserDto): Promise<User> {
    return await this.usersService.findOneUser(request);
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  removeUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.remove(findOneUserDto.id);
  }
}
