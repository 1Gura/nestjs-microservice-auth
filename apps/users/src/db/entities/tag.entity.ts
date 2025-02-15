import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // Теги уникальны
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
