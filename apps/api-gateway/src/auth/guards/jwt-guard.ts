import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const metadata: Metadata = rpcContext.getContext().metadata; // Получаем метаданные

    console.log(metadata);
    if (!metadata) {
      throw new UnauthorizedException('Токен отсутствует');
    }

    try {
      const payload = await this.jwtService.verifyAsync('metadata', {
        secret: process.env.JWT_SECRET,
      });

      // Сохраняем данные пользователя для последующего использования
      context.switchToRpc().getContext()['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Недействительный токен', error);
    }

    return true;
  }
}
