import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Токен отсутствует');
    }

    const isValid = await this.verifyToken(token);
    if (!isValid) {
      throw new UnauthorizedException('Неверный токен');
    }

    return true;
  }

  private async verifyToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: 'prikol',
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
