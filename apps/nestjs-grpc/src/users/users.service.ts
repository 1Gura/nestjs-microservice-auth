import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  PaginationDto,
  UpdateUserDto,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';
import { AUTH_SERVICE } from './constants';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersServiceClient: UsersServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

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

  emailUsers() {
    const users$ = new ReplaySubject<PaginationDto>();

    users$.next({ page: 0, skip: 25 });
    users$.next({ page: 1, skip: 25 });
    users$.next({ page: 2, skip: 25 });
    users$.next({ page: 3, skip: 25 });

    users$.complete();

    let chunkNumber = 1;

    this.usersServiceClient.queryUsers(users$).subscribe((users) => {
      console.log('CHUNK: ', chunkNumber);
      console.log('USERS: ', users);
      chunkNumber++;
    });
  }
}
