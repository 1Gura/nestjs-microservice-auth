import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
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
  User,
  UserInfoRequest,
  UserInfoResponse,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import {
  catchError,
  forkJoin,
  from,
  lastValueFrom,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { USER_SERVICE } from '../../api-gateway/src/constants';
import { validateEmail } from '../../../libs/helpers/validateEmail';
import { hashPassword } from '../../../libs/helpers/hash-password';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { RefreshTokenService } from './refresh-token.service';
import * as process from 'node:process';
import { RefreshToken } from './db/refresh-token.entity';
import { getCurrentDateTime } from '../../../libs/helpers/get-current-date-time';

@Injectable()
export class AuthService implements OnModuleInit {
  private usersServiceClient: UsersServiceClient;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';

  constructor(
    @Inject(USER_SERVICE) private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}
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

  login({
    username,
    password,
    email,
  }: LoginRequest): Observable<LoginResponse> {
    if ((!email && !username) || !password) {
      throw new RpcException('Все поля являются обязательными');
    }

    return this.usersServiceClient.findOneUser({ email }).pipe(
      switchMap(async (user: User) => {
        if (!user.email) {
          throw new RpcException('Пользователь с таким email не был найден');
        }

        // Проверяем пароль
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          throw new RpcException('Неверный пароль');
        }

        // Генерация токена
        const payload = { id: user.id, email: user.email };
        const accessToken = await this.generateAccessToken({
          userId: payload.id,
          email: user.email,
          username: user.username,
        });

        const refreshToken = this.generateRefreshToken();
        // Сохранение RefreshToken в базе через RefreshTokenService
        await this.refreshTokenService.saveRefreshToken({
          user: {
            id: user.id,
            email: user.email,
            password: user.password,
            username: user.username,
          },
          token: refreshToken,
        });

        const userInfoResponse: UserInfoResponse = {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: getCurrentDateTime(),
        };

        // Формируем ответ
        return {
          accessToken,
          refreshToken,
          message: 'Успешный вход',
          success: true,
          user: userInfoResponse,
        };
      }),
    );
  }

  register(
    registerRequest: RegisterRequest,
  ): Observable<RegisterResponse> | RegisterResponse {
    let accessToken = '';
    let refreshToken = '';
    let newUser: any;

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
          // TODO изменить ответ на возможность получения null или undefined, сейчас тут костыль
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
          newUser = user;

          return forkJoin([
            from(
              this.generateAccessToken({
                userId: newUser.id,
                email: email,
                username: newUser.username,
              }),
            ),
            of(this.generateRefreshToken()),
          ]);
        }),
        tap(([access, refresh]: string[]) => {
          accessToken = access;
          refreshToken = refresh;
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        switchMap(([_accessToken, refreshToken]: string[]) =>
          from(
            this.refreshTokenService.saveRefreshToken({
              user: {
                id: newUser.id,
                email: newUser.email,
                password: newUser.password,
                username: newUser.username,
              },
              token: refreshToken,
            }),
          ),
        ),
        switchMap(() => {
          const userInfoRequest = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
          } as UserInfoRequest;

          return of({
            user: userInfoRequest,
            message: `Пользователь зарегистрирован: ${newUser.username}, ${newUser.email}`,
            success: true,
            refreshToken,
            accessToken,
          } as RegisterResponse);
        }),
      );
  }

  async logout({ token }: LogoutRequest): Promise<LogoutResponse> {
    // Удаляем токен
    await this.refreshTokenService.deleteRefreshToken(token);

    return {
      success: true,
      message: 'Refresh token was deleted',
    };
  }

  refreshToken({
    refreshToken,
  }: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return from(
      this.refreshTokenService.findRefreshTokenByToken(refreshToken),
    ).pipe(
      switchMap((refreshTokenResponse: RefreshToken) => {
        if (refreshToken !== refreshTokenResponse.refreshToken) {
          throw {
            accessToken: '',
            refreshToken: '',
            message: 'SUCCESS',
            valid: true,
          };
        }

        return of(refreshTokenResponse);
      }),
      switchMap((refreshTokenResponse: RefreshToken) =>
        this.usersServiceClient.findOneUser({
          id: refreshTokenResponse.userId,
        }),
      ),
      switchMap(async (user: User) => {
        const accessToken = await this.generateAccessToken({
          userId: user.id,
          email: user.email,
          username: user.username,
        });

        const refreshToken = this.generateRefreshToken();

        await this.refreshTokenService.saveRefreshToken({
          user: {
            id: user.id,
            email: user.email,
            password: user.password,
            username: user.username,
          },
          token: refreshToken,
        });

        return {
          valid: true,
          message: 'SUCCESS',
          accessToken,
          refreshToken,
        } as RefreshTokenResponse;
      }),
      catchError((error: Error) => {
        return of({
          accessToken: '',
          refreshToken: '',
          message: error.message,
          valid: false,
        });
      }),
    );
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

  userInfo({ username, id }: UserInfoRequest): UserInfoResponse {
    if (username) {
      const currentDate = new Date();
      return {
        username,
        email: 'user@mail.com',
        createdAt: currentDate.toString(),
        id,
      };
    }

    throw new Error('USER_NOT_FOUND');
  }

  // Генерация accessToken
  private generateAccessToken(payload: {
    userId: string;
    email: string;
    username: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  // Генерация refreshToken
  private generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
