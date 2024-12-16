import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CheckTokenRequest,
  CheckTokenResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfoRequest,
  UserInfoResponse,
} from '@app/common';

@Injectable()
export class AuthService implements OnModuleInit {
  private auth_tokens = [];
  onModuleInit(): void {}
  login({ username, password }: LoginRequest): LoginResponse {
    // В продакшн-коде тут должна быть валидация юзера (БД)
    if (username === 'admin' && password === 'password') {
      const loginResponseSuccess = {
        message: 'Success',
        token: 'MOCK_TOCKEN',
        refreshToken: 'MOCK_REFRESH_TOKEN',
        success: true,
      };

      this.auth_tokens.push(loginResponseSuccess);

      return loginResponseSuccess;
    }
    throw new Error('Invalid credentials');
  }

  register(registerRequest: RegisterRequest): RegisterResponse {
    if (
      registerRequest?.username &&
      registerRequest?.password &&
      registerRequest?.email
    ) {
      return { message: 'SUCCESS', success: true };
    }

    throw new Error('Invalid credentials');
  }

  logout({ token }: LogoutRequest): LogoutResponse {
    if (token) {
      return { message: 'SUCCESS', success: true };
    }

    return { message: 'TOKEN_NOT_FOUND', success: true };
  }

  checkToken({ token }: CheckTokenRequest): CheckTokenResponse {
    if (token === 'mockAccessToken123') {
      return { message: 'SUCCESS', valid: true };
    }

    return { valid: false, message: 'NOT_FOUNDED' };
  }

  changePassword({
    oldPassword,
    newPassword,
    username,
  }: ChangePasswordRequest): ChangePasswordResponse {
    if (oldPassword && newPassword && username) {
      return { message: 'SUCCESS', success: true };
    }

    return { message: 'PASSWORDS_INCORRECT', success: true };
  }

  userInfo({ username }: UserInfoRequest): UserInfoResponse {
    if (username) {
      const currentDate = new Date();
      return {
        username,
        email: 'user@mail.com',
        createdAt: currentDate.toString(),
      };
    }

    throw new Error('USER_NOT_FOUND');
  }
}
