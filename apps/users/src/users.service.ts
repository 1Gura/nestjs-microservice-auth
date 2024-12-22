import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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
    const user: User = {
      ...createUserDto,
      id: '',
      subscribed: false,
      socialMedia: { fbUri: undefined, twitterUri: undefined },
    };

    const newUser = this.userRepository.create({
      email: user.email,
      password: user.password,
    });

    await this.userRepository.save(newUser);

    user.id = `${newUser.id}`;

    return user;
  }

  findAll(): Users {
    return { users: this.users };
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
}
