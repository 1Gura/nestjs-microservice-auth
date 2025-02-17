import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CreatePostRequest,
  ListPostsRequest,
  UpdatePostRequest,
} from '@app/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  create(@Body() data: CreatePostRequest) {
    return this.postService.create(data);
  }

  @Get()
  findAll(request: ListPostsRequest) {
    return this.postService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() request: UpdatePostRequest) {
    return this.postService.update(request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove({ id });
  }
}
