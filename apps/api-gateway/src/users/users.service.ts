import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE } from '../constants';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersServiceClient: UsersServiceClient;

  constructor(@Inject(USER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersServiceClient =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.usersServiceClient.createUser(createUserDto);
  }

  findAll() {
    return this.usersServiceClient.findAllUsers({});
  }

  findOne(id: string) {
    return this.usersServiceClient.findOneUser({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersServiceClient.updateUser({ id, ...updateUserDto });
  }

  remove(id: string) {
    return this.usersServiceClient.removeUser({ id });
  }
}
