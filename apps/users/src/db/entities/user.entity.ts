import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Идентификатор пользователя

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string; // Захэшированный пароль

  // Добавляем связь один ко многим
  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];
}
