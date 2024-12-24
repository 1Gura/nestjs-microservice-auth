import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User, Users } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Entities from './db/entities/index';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];

  constructor(
    @InjectRepository(Entities.User)
    private readonly userRepository: Repository<Entities.User>,
  ) {}

  onModuleInit() {}

  async findByEmail(email: string): Promise<Entities.User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Проверка на существование email
    const emailIsExist = await this.isEmailTaken(createUserDto.email);
    if (emailIsExist) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    console.log('2');

    const user: Partial<User> = {
      ...createUserDto,
      subscribed: false,
      socialMedia: { fbUri: undefined, twitterUri: undefined },
    };

    const newUser: Entities.User = this.userRepository.create({
      email: user.email,
      password: user.password,
    });

    await this.userRepository.save(newUser);

    user.id = `${newUser.id}`;

    return user as User;
  }

  async findAll() {
    const users = await this.userRepository.find();

    const dtoUsers = users.map(
      (user) =>
        ({
          age: 0,
          password: user.password,
          username: user.email,
          email: user.email,
          id: `${user.id}`,
          socialMedia: {},
          subscribed: false,
        }) as User,
    );

    return {
      users: dtoUsers,
    } as Users;
  }

  findOne(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
      };

      return this.users[userIndex];
    }

    throw new NotFoundException(`User not found by ${id}`);
  }

  remove(id: string): User {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      return this.users.splice(userIndex)[0];
    }

    throw new NotFoundException(`User not found by ${id}`);
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    return !!existingUser; // Вернет true, если пользователь найден
  }
}
