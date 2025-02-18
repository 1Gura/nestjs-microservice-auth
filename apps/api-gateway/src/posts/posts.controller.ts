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
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() data: CreatePostRequest) {
    return this.postsService.create(data);
  }

  @Post('get-list')
  findAll(@Body() request: ListPostsRequest) {
    return this.postsService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() request: UpdatePostRequest) {
    return this.postsService.update(request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove({ id });
  }
}
