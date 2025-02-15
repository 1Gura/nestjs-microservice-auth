import { Injectable } from '@nestjs/common';
import {
  CreatePostRequest,
  ListPostsRequest,
  PostResponse,
  UpdatePostRequest,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Entities from '../db/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Entities.User)
    private readonly userRepository: Repository<Entities.User>,
    @InjectRepository(Entities.Post)
    private readonly postRepository: Repository<Entities.Post>,
  ) {}

  // Логика для постов
  async createPost(data: CreatePostRequest): Promise<PostResponse> {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    if (!user) throw new Error('User not found');

    const post = this.postRepository.create({});

    const createdPost = await this.postRepository.save(post);

    return {
      id: createdPost.id,
      files: [],
      tags: createdPost.tags,
      altText: createdPost.altText,
      userId: createdPost.userId,
      location: createdPost.location,
      caption: createdPost.caption,
    };
  }

  async getPost(id: string): Promise<PostResponse> {
    const foundPost = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return {
      id: foundPost.id,
      files: [],
      tags: foundPost.tags,
      altText: foundPost.altText,
      userId: foundPost.userId,
      location: foundPost.location,
      caption: foundPost.caption,
    };
  }

  async listPosts(filters: ListPostsRequest): Promise<PostResponse[]> {
    const query = this.postRepository.createQueryBuilder('post');

    if (filters.userId) {
      query.andWhere('post.userId = :userId', { userId: filters.userId });
    }

    if (filters.tags && filters.tags.length > 0) {
      query.andWhere('post.tags && ARRAY[:...tags]', { tags: filters.tags });
    }

    if (filters.location) {
      query.andWhere('post.location = :location', {
        location: filters.location,
      });
    }

    const posts = await query.getMany();

    return posts.map(
      (post) =>
        ({
          id: post.id,
          caption: post.caption,
          location: post.location,
          userId: post.userId,
          altText: post.altText,
          tags: post.tags,
          files: [],
        }) as PostResponse,
    );
  }

  async updatePost(data: UpdatePostRequest): Promise<PostResponse> {
    await this.postRepository.update(data.id, data);
    return this.getPost(data.id);
  }

  async deletePost(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
