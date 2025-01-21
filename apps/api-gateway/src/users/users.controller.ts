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
import { CreateUserDto, UpdateUserDto } from '@app/common';
import { catchError, throwError } from 'rxjs';
import { AuthGuard } from '@app/common/guards/auth-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
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
    return this.usersService.findOne(id);
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
