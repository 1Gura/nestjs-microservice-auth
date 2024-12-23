import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Имя таблицы в базе данных
export class User {
  @PrimaryGeneratedColumn('uuid') // Используем UUID для строкового идентификатора
  id: string;

  @Column({ unique: true })
  email: string; // Логин пользователя

  @Column()
  password: string; // Захэшированный пароль
}
