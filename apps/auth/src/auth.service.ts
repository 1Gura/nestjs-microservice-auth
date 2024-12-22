import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
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
  User,
  UserInfoRequest,
  UserInfoResponse,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { USER_SERVICE } from '../../nestjs-grpc/src/constants';

@Injectable()
export class AuthService implements OnModuleInit {
  private auth_tokens = [];
  private usersService: UsersServiceClient;

  constructor(@Inject(USER_SERVICE) private readonly client: ClientGrpc) {}
  onModuleInit(): void {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user: User = await lastValueFrom(
      this.usersService.findOneUser({ email }),
    );
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  }

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

  register(
    registerRequest: RegisterRequest,
  ): Observable<RegisterResponse> | RegisterResponse {
    if (
      registerRequest?.username &&
      registerRequest?.password &&
      registerRequest?.email
    ) {
      // return this.usersService
      //   .createUser({
      //     username: registerRequest.username,
      //     password: registerRequest.password,
      //     email: registerRequest.email,
      //     age: 0,
      //   })
      //   .pipe(
      //     map((user: User) => {
      //       console.log(user);
      //       debugger;
      //
      //       return {
      //         message: `${user.id}, ${user.email}, ${user.password}, ${user.username}, ${user.age}`,
      //         success: true,
      //       } as RegisterResponse;
      //     }),
      //     take(1),
      //   );

      return { message: 'AUTH', success: true };
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
