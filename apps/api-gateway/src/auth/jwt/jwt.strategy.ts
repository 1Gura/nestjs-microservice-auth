import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Берем токен из заголовка Authorization
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'prikol', // Секретный ключ
    });
  }

  async validate(payload: { userId: number; email: string; username: string }) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    }; // Возвращаем `id` пользователя
  }
}
