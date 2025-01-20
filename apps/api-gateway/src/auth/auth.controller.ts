import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
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
import { Request } from 'express';

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

  @Post('/checkaccesstoken')
  @UseInterceptors(TokenInterceptor)
  checkToken(
    @Body() request: CheckTokenRequest,
    @Req() req: Request,
  ): Observable<CheckTokenResponse> {
    return this.authService.checkToken(request, req);
  }

  @Post('/checkrefreshtoken')
  checkRefreshToken(@Body() request: CheckTokenRequest, @Req() req: Request) {
    console.log('data');
    return this.authService.checkToken(request, req);
  }
}
