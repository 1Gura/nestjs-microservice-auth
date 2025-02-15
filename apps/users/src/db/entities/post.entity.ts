import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File, Tag, User } from '.';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Идентификатор поста

  @Column()
  caption: string;

  @Column()
  location: string;

  @Column()
  altText: string;

  @OneToMany(() => File, (file) => file.post, { cascade: true })
  files: File[];

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;
  @Column({ nullable: true })
  userId?: string;

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true }) // Связь с тегами
  @JoinTable({
    name: 'post_tags', // Название промежуточной таблицы
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
