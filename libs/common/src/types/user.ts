// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               v5.29.3
// source: user.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufUserPackage = "user";

export interface Empty {
}

export interface FindOneUserDto {
  id?: string | undefined;
  email?: string | undefined;
}

export interface UpdateUserDto {
  id: string;
  socialMedia: SocialMedia | undefined;
}

export interface Users {
  users: User[];
}

export interface CreateUserDto {
  username: string;
  password: string;
  age: number;
  email: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  age: number;
  subscribed: boolean;
  socialMedia: SocialMedia | undefined;
  email: string;
}

export interface SocialMedia {
  twitterUri?: string | undefined;
  fbUri?: string | undefined;
}

export interface PostResponse {
  id: string;
  caption: string;
  location?: string | undefined;
  altText?: string | undefined;
  tags: Tag[];
  files: FileResponse[];
  userId: string;
}

export interface CreatePostRequest {
  caption: string;
  location?: string | undefined;
  altText?: string | undefined;
  tags: string[];
  files: FileResponse[];
  userId: string;
}

export interface GetPostRequest {
  id: string;
}

export interface ListPostsRequest {
  userId?: string | undefined;
  tags: string[];
  location?: string | undefined;
}

export interface ListPostsResponse {
  posts: PostResponse[];
}

export interface UpdatePostRequest {
  id: string;
  caption: string;
  location?: string | undefined;
  altText?:
    | string
    | undefined;
  /** Массив тегов (необязательное поле) */
  tags: Tag[];
  files: FileResponse[];
  userId: string;
}

export interface DeletePostRequest {
  id: string;
}

/** TAGS */
export interface Tag {
  id: string;
  name: string;
}

/**
 * FILES
 * Описание при создании файла (метаданные)
 */
export interface FileRequest {
  /** Имя файла */
  filename: string;
  /** Тип файла (например, image/jpeg) */
  mimeType: string;
  /** Бинарные данные файла (Blob) */
  fileData: Uint8Array;
  /** Размер файла в байтах */
  fileSize: number;
}

export interface FileResponse {
  /** Имя файла */
  filename: string;
  /** Тип файла (например, image/jpeg) */
  mimeType: string;
  fileUrl: string;
  /** Размер файла в байтах */
  fileSize: number;
}

export const USER_PACKAGE_NAME = "user";

export interface UsersServiceClient {
  createUser(request: CreateUserDto): Observable<User>;

  findAllUsers(request: Empty): Observable<Users>;

  findOneUser(request: FindOneUserDto): Observable<User>;

  updateUser(request: UpdateUserDto): Observable<User>;

  removeUser(request: FindOneUserDto): Observable<User>;

  /** Добавляем новые методы для постов */

  createPost(request: CreatePostRequest): Observable<PostResponse>;

  getPost(request: GetPostRequest): Observable<PostResponse>;

  listPosts(request: ListPostsRequest): Observable<ListPostsResponse>;

  updatePost(request: UpdatePostRequest): Observable<PostResponse>;

  deletePost(request: DeletePostRequest): Observable<Empty>;
}

export interface UsersServiceController {
  createUser(request: CreateUserDto): Promise<User> | Observable<User> | User;

  findAllUsers(request: Empty): Promise<Users> | Observable<Users> | Users;

  findOneUser(request: FindOneUserDto): Promise<User> | Observable<User> | User;

  updateUser(request: UpdateUserDto): Promise<User> | Observable<User> | User;

  removeUser(request: FindOneUserDto): Promise<User> | Observable<User> | User;

  /** Добавляем новые методы для постов */

  createPost(request: CreatePostRequest): Promise<PostResponse> | Observable<PostResponse> | PostResponse;

  getPost(request: GetPostRequest): Promise<PostResponse> | Observable<PostResponse> | PostResponse;

  listPosts(request: ListPostsRequest): Promise<ListPostsResponse> | Observable<ListPostsResponse> | ListPostsResponse;

  updatePost(request: UpdatePostRequest): Promise<PostResponse> | Observable<PostResponse> | PostResponse;

  deletePost(request: DeletePostRequest): Promise<Empty> | Observable<Empty> | Empty;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "findAllUsers",
      "findOneUser",
      "updateUser",
      "removeUser",
      "createPost",
      "getPost",
      "listPosts",
      "updatePost",
      "deletePost",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";
