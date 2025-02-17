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

  @OneToMany(() => Post, (post) => post.user, { nullable: true }) // Делаем связь необязательной
  posts?: Post[];
}
