import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    debugger;

    return next.handle().pipe(
      map((data) => {
        if (data?.refreshToken) {
          response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          // Убираем refreshToken из тела ответа
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { refreshToken, ...rest } = data;
          return rest; // Возвращаем объект без refreshToken
        }

        return data;
      }),
    );
  }
}
