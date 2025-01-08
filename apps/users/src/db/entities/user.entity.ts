import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
