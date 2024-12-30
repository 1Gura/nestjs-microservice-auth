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
import { from, lastValueFrom, map, Observable, switchMap, take } from 'rxjs';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { USER_SERVICE } from '../../api-gateway/src/constants';
import { validateEmail } from '../../../libs/helpers/validateEmail';
import { hashPassword } from '../../../libs/helpers/hash-password';
import { generateAuthToken } from '../../../libs/helpers/generate-auth-token';

@Injectable()
export class AuthService implements OnModuleInit {
  private auth_tokens = [];
  private usersServiceClient: UsersServiceClient;

  constructor(@Inject(USER_SERVICE) private readonly client: ClientGrpc) {}
  onModuleInit(): void {
    this.usersServiceClient =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user: User = await lastValueFrom(
      this.usersServiceClient.findOneUser({ email }),
    );
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  }

  login({ username, password }: LoginRequest): LoginResponse {
    // В продакшн-коде тут должна быть валидация юзера (БД)
    if (username === 'admin' && password === 'password') {
      const loginResponseSuccess: LoginResponse = {
        user: undefined,
        message: 'Success',
        accessToken: 'MOCK_TOCKEN',
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
    const { email, password, username } = registerRequest;
    // Валидация входных данных
    if (!email || !password || !username) {
      throw new RpcException('Все поля являются обязательными!');
    }

    if (!validateEmail(email)) {
      throw new RpcException('Некорректный формат email');
    }

    if (password.length < 5) {
      throw new RpcException('Пароль должен быть не менее 5 символов');
    }

    return this.usersServiceClient
      .findOneUser({ id: undefined, email: email })
      .pipe(
        take(1),
        switchMap((existingUser: User) => {
          if (existingUser?.email) {
            throw new RpcException('Пользователь с таким email уже существует');
          }

          return from(hashPassword(password));
        }),
        switchMap((hashedPassword: string) =>
          this.usersServiceClient.createUser({
            password: hashedPassword,
            email,
            username,
            age: 0,
          }),
        ),
        switchMap((user: User) => {
          return from(generateAuthToken(user.id)).pipe(
            map((accessToken: string) => {
              return {
                message: `Пользователь зарегистрирован: ${user.username}, ${user.email}`,
                success: true,
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                },
                accessToken,
                refreshToken: '',
              } as RegisterResponse;
            }),
          );
        }),
      );
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
