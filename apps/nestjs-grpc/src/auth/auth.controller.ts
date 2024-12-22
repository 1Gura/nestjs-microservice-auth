import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest, RegisterResponse } from '@app/common';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(
    @Body() registerRequest: RegisterRequest,
  ): Observable<RegisterResponse> {
    return this.authService.register(registerRequest);
  }

  @Post('/login')
  login(@Body() loginRequest: LoginRequest): Observable<RegisterResponse> {
    return this.authService.login(loginRequest);
  }
}
