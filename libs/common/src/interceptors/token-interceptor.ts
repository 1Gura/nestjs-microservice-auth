import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import * as dotenv from 'dotenv';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {
    dotenv.config();
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    return this.validateToken(token).pipe(
      switchMap((tokenIsValid) => {
        if (tokenIsValid) {
          return next.handle();
        }
        throw new UnauthorizedException('Invalid or expired token');
      }),
    );
  }

  private validateToken(token: string) {
    return from(
      this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'prikol',
      }),
    ).pipe(
      take(1),
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }
}
