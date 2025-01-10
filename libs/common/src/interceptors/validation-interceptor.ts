import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  UnauthorizedException,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = context.switchToRpc().getContext(); // Получение gRPC метаданных
    const apiGatewayHeader = metadata?.get('x-api-gateway')?.[0]; // Доступ к заголовку

    if (!apiGatewayHeader || apiGatewayHeader !== process.env.SECRET_HEADER) {
      throw new UnauthorizedException('Access denied: invalid gateway header');
    }

    return next.handle(); // Продолжение обработки
  }
}
