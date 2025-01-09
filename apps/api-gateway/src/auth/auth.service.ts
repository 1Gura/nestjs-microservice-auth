import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
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
import { AUTH_SERVICE } from '../constants';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

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
    metadata.add('x-api-gateway', 'secure-gateway'); // Добавляем заголовок
    return this.authServiceClient.login(request, metadata);
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.authServiceClient.register(request);
  }

  checkToken(request: CheckTokenRequest): Observable<CheckTokenResponse> {
    return this.authServiceClient.checkToken(request);
  }

  logout(request: LogoutRequest): Observable<LogoutResponse> {
    return this.authServiceClient.logout(request);
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
