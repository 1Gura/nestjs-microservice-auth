import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CheckTokenRequest,
  CheckTokenResponse,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from '@app/common';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenInterceptor } from '@app/common/interceptors/token-interceptor';
import { CookieInterceptor } from '@app/common/interceptors/сookie-interceptor';

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
    return this.authService.login(request);
  }

  @Post('/logout')
  logout(@Body() request: LogoutRequest): Observable<LogoutResponse> {
    return this.authService.logout(request);
  }

  @Post('/checktoken')
  @UseInterceptors(TokenInterceptor)
  checkToken(
    @Body() request: CheckTokenRequest,
  ): Observable<CheckTokenResponse> {
    return this.authService.checkToken(request);
  }
}
