import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Идентификатор файла

  @Column()
  filename: string; // Имя файла в хранилище

  @Column()
  mimeType: string; // Тип файла (например, image/jpeg)

  @Column()
  fileSize: number; // Размер файла в байтах

  @Column()
  fileUrl: string; // URL в хранилище

  @ManyToOne(() => Post, (post) => post.files, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  postId: string; // ID поста, к которому прикреплен файл
}
