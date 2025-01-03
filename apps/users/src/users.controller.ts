import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  FindOneUserDto,
  UpdateUserDto,
  User,
  UsersServiceController,
  UsersServiceControllerMethods,
} from '@app/common';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAll();
  }

  async findOneUser(request: FindOneUserDto): Promise<User> {
    return await this.usersService.findOneUser(request);
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  removeUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.remove(findOneUserDto.id);
  }
}
