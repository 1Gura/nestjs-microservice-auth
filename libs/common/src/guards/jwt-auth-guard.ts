import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    dotenv.config();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    try {
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: 'prikol',
      });
      console.log('DECODED', decoded);
      request.body = { ...request.body, userId: decoded.sub };

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
