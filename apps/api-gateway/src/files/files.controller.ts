import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../../users/src/db/entities';

@Controller('files')
export class FileController {
  constructor(@InjectRepository(File) private fileRepo: Repository<File>) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          console.log('FILE', file);
          const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFiles(
    @Query('postId') postId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const newFile = this.fileRepo.create({
          filename: file.filename,
          fileUrl: `/uploads/${file.filename}`,
          mimeType: file.mimetype,
          fileSize: file.size,
          postId,
        });
        return this.fileRepo.save(newFile);
      }),
    );
    console.log('SAVED_FILES', savedFiles);
    return savedFiles; // Возвращаем массив метаданных файлов
  }
}
