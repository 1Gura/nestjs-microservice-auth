import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Имя таблицы в базе данных
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string; // Логин пользователя

  @Column()
  password: string; // Захэшированный пароль
}
