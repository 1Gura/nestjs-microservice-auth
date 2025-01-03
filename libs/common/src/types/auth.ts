// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               v5.29.2
// source: auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const authProtobufPackage = "auth";

/** Сообщение для отправки данных для логина */
export interface LoginRequest {
  /** Имя пользователя */
  username: string;
  /** Пароль пользователя */
  password: string;
}

/** Сообщение для ответа на запрос логина */
export interface LoginResponse {
  /** Токен для аутентификации (JWT или другой) */
  accessToken: string;
  /** Рефреш-токен для обновления доступа */
  refreshToken: string;
  /** Успешность логина */
  success: boolean;
  /** Сообщение об ошибке или успехе */
  message: string;
  user: UserInfoRequest | undefined;
}

/** Сообщение для регистрации нового пользователя */
export interface RegisterRequest {
  /** Имя пользователя */
  username: string;
  /** Пароль */
  password: string;
  /** Электронная почта */
  email: string;
}

/** Ответ на запрос регистрации */
export interface RegisterResponse {
  /** Успешность регистрации */
  success: boolean;
  /** Сообщение об ошибке или успехе */
  message: string;
  /** токен */
  accessToken: string;
  /** Рефреш-токен для обновления доступа */
  refreshToken: string;
  user: UserInfoRequest | undefined;
}

/** Сообщение для проверки токена */
export interface CheckTokenRequest {
  /** Токен для проверки */
  token: string;
}

/** Ответ на запрос проверки токена */
export interface CheckTokenResponse {
  /** Является ли токен действительным */
  valid: boolean;
  /** Сообщение о статусе токена */
  message: string;
}

/** Сообщение для запроса на выход (logout) */
export interface LogoutRequest {
  /** Токен, который нужно отозвать */
  token: string;
}

/** Ответ на запрос выхода */
export interface LogoutResponse {
  /** Успешность выхода */
  success: boolean;
  /** Сообщение */
  message: string;
}

/** Сообщение для изменения пароля */
export interface ChangePasswordRequest {
  /** Имя пользователя */
  username: string;
  /** Старый пароль */
  oldPassword: string;
  /** Новый пароль */
  newPassword: string;
}

/** Ответ на запрос изменения пароля */
export interface ChangePasswordResponse {
  /** Успешность изменения пароля */
  success: boolean;
  /** Сообщение */
  message: string;
}

/** Сообщение для получения данных пользователя */
export interface UserInfoRequest {
  /** Имя пользователя */
  username: string;
  id: string;
  email: string;
}

/** Ответ на запрос получения информации о пользователе */
export interface UserInfoResponse {
  /** Имя пользователя */
  username: string;
  /** Электронная почта */
  email: string;
  /** Дата создания аккаунта */
  createdAt: string;
}

export const AUTH_PACKAGE_NAME = "auth";

/** Сервис аутентификации и авторизации */

export interface AuthServiceClient {
  /** Метод для логина */

  login(request: LoginRequest): Observable<LoginResponse>;

  /** Метод для регистрации */

  register(request: RegisterRequest): Observable<RegisterResponse>;

  /** Метод для проверки токена */

  checkToken(request: CheckTokenRequest): Observable<CheckTokenResponse>;

  /** Метод для выхода из системы */

  logout(request: LogoutRequest): Observable<LogoutResponse>;

  /** Метод для изменения пароля */

  changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse>;

  /** Метод для получения информации о пользователе */

  userInfo(request: UserInfoRequest): Observable<UserInfoResponse>;
}

/** Сервис аутентификации и авторизации */

export interface AuthServiceController {
  /** Метод для логина */

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  /** Метод для регистрации */

  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  /** Метод для проверки токена */

  checkToken(
    request: CheckTokenRequest,
  ): Promise<CheckTokenResponse> | Observable<CheckTokenResponse> | CheckTokenResponse;

  /** Метод для выхода из системы */

  logout(request: LogoutRequest): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;

  /** Метод для изменения пароля */

  changePassword(
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> | Observable<ChangePasswordResponse> | ChangePasswordResponse;

  /** Метод для получения информации о пользователе */

  userInfo(request: UserInfoRequest): Promise<UserInfoResponse> | Observable<UserInfoResponse> | UserInfoResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "register", "checkToken", "logout", "changePassword", "userInfo"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
