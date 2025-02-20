import { Injectable } from '@nestjs/common';
import {
  CreatePostRequest,
  FileRequest,
  ListPostsRequest,
  PostResponse,
  UpdatePostRequest,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Entities from '../db/entities';
import { Repository } from 'typeorm';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Entities.User)
    private readonly userRepository: Repository<Entities.User>,
    @InjectRepository(Entities.Post)
    private readonly postRepository: Repository<Entities.Post>,
    @InjectRepository(Entities.Tag)
    private readonly tagRepository: Repository<Entities.Tag>,
    @InjectRepository(Entities.File)
    private readonly fileRepository: Repository<Entities.File>,
  ) {}

  // Логика для постов
  async createPost(data: CreatePostRequest): Promise<PostResponse> {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) throw new Error('User not found');

    const allTags = await this.getAllTags(data.tags);

    const post = this.postRepository.create({
      caption: data.caption,
      userId: data.userId,
      altText: data.altText,
      location: data.location,
      tags: allTags,
      files: data.files,
      user,
    });

    const createdPost = await this.postRepository.save(post);

    return {
      id: createdPost.id,
      files: createdPost.files,
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

    console.log(filters);

    if (filters.userId) {
      query.andWhere('post.userId = :userId', { userId: filters.userId });
    }

    if (filters.tags && filters.tags.length > 0) {
      query
        .innerJoin('post.tags', 'tag') // Присоединяем таблицу tags
        .andWhere('tag.name IN (:...tags)', { tags: filters.tags }); // Фильтр по именам тегов
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

  private async getAllTags(tags: string[]): Promise<Entities.Tag[]> {
    // Проверяем, какие теги уже существуют в базе
    const existingTags = await this.tagRepository.find({
      where: tags.map((tag) => ({ name: tag })),
    });

    // Получаем список имен уже существующих тегов
    const existingTagNames = existingTags.map((tag) => tag.name);

    // Фильтруем новые теги, которых нет в базе
    const newTagNames = tags.filter((tag) => !existingTagNames.includes(tag));

    // Создаём новые теги, если есть
    const newTags = this.tagRepository.create(
      newTagNames.map((name) => ({ name })),
    );

    await this.tagRepository.save(newTags);

    // Объединяем существующие и новые теги
    return [...existingTags, ...newTags];
  }

  private async saveFilesLocallyAndStoreMetadata(
    files: FileRequest[],
  ): Promise<Entities.File[]> {
    if (!files || files.length === 0) return [];

    const uploadDir = path.join(__dirname, '..', '..', 'uploads');

    // 🔹 Проверяем, существует ли папка, если нет — создаём
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedFiles: Entities.File[] = [];

    for (const fileData of files) {
      const fileExtension = path.extname(fileData.filename); // Расширение файла
      const fileName = `${uuidv4()}${fileExtension}`; // Уникальное имя
      const filePath = path.join(uploadDir, fileName);

      // 🔹 Записываем файл в файловую систему
      fs.writeFileSync(filePath, fileData.fileData);

      // 🔹 Создаём запись о файле в БД
      const fileEntity = this.fileRepository.create({
        filename: fileName,
        mimeType: fileData.mimeType,
        fileSize: fileData.fileSize,
        fileUrl: `/uploads/${fileName}`,
      });

      savedFiles.push(await this.fileRepository.save(fileEntity));
    }

    return savedFiles;
  }
}
