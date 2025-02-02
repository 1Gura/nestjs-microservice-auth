import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, User, Users } from '@app/common';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthGuard } from '@app/common/guards/auth-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get()
  findAll(): Observable<Users> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findUserById(@Param('id') id: string): Observable<User> {
    return this.usersService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  findUserByEmail(@Param('email') email: string): Observable<User> {
    console.log('EMAIl');
    return this.usersService.findOneByEmail(email);
  }

  @Post('create')
  create(@Body() createUserRequest: CreateUserDto) {
    return this.usersService.create(createUserRequest).pipe(
      catchError((error) => {
        if (error.details) {
          return throwError(() => new BadRequestException(error.details));
        }

        return throwError(
          () =>
            new BadRequestException(
              'Произошла ошибка при создании пользователя',
            ),
        );
      }),
    );
  }

  @Post('login')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
