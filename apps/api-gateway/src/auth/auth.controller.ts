import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from '@app/common';
import { catchError, Observable, throwError } from 'rxjs';
import { CookieInterceptor } from '@app/common/interceptors/сookie-interceptor';
import { Request } from 'express';
import { AuthGuard } from '@app/common/guards/auth-guard';

@Controller('auth')
@UseInterceptors(CookieInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(
    @Body() registerRequest: RegisterRequest,
  ): Observable<RegisterResponse> {
    return this.authService.register(registerRequest).pipe(
      catchError((error) => {
        if (error.details) {
          return throwError(() => new BadRequestException(error.details));
        }

        return throwError(
          () => new BadRequestException('Произошла ошибка при регистрации'),
        );
      }),
    );
  }

  @Post('/login')
  login(@Body() request: LoginRequest): Observable<RegisterResponse> {
    return this.authService.login(request).pipe(
      catchError((error) => {
        if (error.details) {
          return throwError(() => new BadRequestException(error.details));
        }

        return throwError(
          () => new BadRequestException('Произошла ошибка при регистрации'),
        );
      }),
    );
  }

  @Post('/logout')
  logout(@Body() request: LogoutRequest): Observable<LogoutResponse> {
    return this.authService.logout(request);
  }

  @UseGuards(AuthGuard)
  @Get('check')
  checkAuth(): { isAuthenticated: boolean } {
    // Если токен валиден, пользователь считается авторизованным
    return { isAuthenticated: true };
  }

  @Post('/refresh-token')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }
}
