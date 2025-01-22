import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfoRequest,
  UserInfoResponse,
} from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  login(
    request: LoginRequest,
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    return this.authService.login(request);
  }
  register(
    request: RegisterRequest,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse {
    return this.authService.register(request);
  }
  refreshToken(
    request: RefreshTokenRequest,
  ):
    | Promise<RefreshTokenResponse>
    | Observable<RefreshTokenResponse>
    | RefreshTokenResponse {
    return this.authService.refreshToken(request);
  }
  logout(
    request: LogoutRequest,
  ): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse {
    return this.authService.logout(request);
  }
  changePassword(
    request: ChangePasswordRequest,
  ):
    | Promise<ChangePasswordResponse>
    | Observable<ChangePasswordResponse>
    | ChangePasswordResponse {
    return this.authService.changePassword(request);
  }
  userInfo(
    request: UserInfoRequest,
  ):
    | Promise<UserInfoResponse>
    | Observable<UserInfoResponse>
    | UserInfoResponse {
    return this.authService.userInfo(request);
  }
}
