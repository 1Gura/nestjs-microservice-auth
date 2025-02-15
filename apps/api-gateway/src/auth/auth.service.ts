import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  UserInfoRequest,
  UserInfoResponse,
} from '@app/common';
import { AUTH_SERVICE } from '../constants';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import * as process from 'node:process';
import { Request } from 'express';

@Injectable()
export class AuthService implements OnModuleInit {
  private authServiceClient: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.authServiceClient =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const metadata = new Metadata();
    metadata.add('x-api-gateway', process.env.SECRET_HEADER); // Добавляем заголовок
    return this.authServiceClient.login(request, metadata);
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    const metadata = new Metadata();
    metadata.add('x-api-gateway', process.env.SECRET_HEADER); // Добавляем заголовок
    return this.authServiceClient.register(request, metadata);
  }

  getUserInfoByAccessToken(request: LoginRequest): Observable<LoginResponse> {
    const metadata = new Metadata();
    metadata.add('x-api-gateway', process.env.SECRET_HEADER); // Добавляем заголовок
    return this.authServiceClient.login(request, metadata);
  }

  refreshToken(req: Request): Observable<RefreshTokenRequest> {
    const refreshToken = req?.cookies.refreshToken;
    if (!refreshToken) {
      throw new HttpException(
        'Refresh token not provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const metadata = new Metadata();
    metadata.add('x-api-gateway', process.env.SECRET_HEADER); // Добавляем заголовок
    return this.authServiceClient.refreshToken(
      { refreshToken: refreshToken },
      metadata,
    );
  }

  logout(request: LogoutRequest): Observable<LogoutResponse> {
    const metadata = new Metadata();
    metadata.add('x-api-gateway', process.env.SECRET_HEADER); // Добавляем заголовок
    return this.authServiceClient.logout(request, metadata);
  }

  changePassword(
    request: ChangePasswordRequest,
  ): Observable<ChangePasswordResponse> {
    return this.authServiceClient.changePassword(request);
  }

  userInfo(request: UserInfoRequest): Observable<UserInfoResponse> {
    return this.authServiceClient.userInfo(request);
  }
}
