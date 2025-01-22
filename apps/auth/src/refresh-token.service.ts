import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './db/refresh-token.entity';
import { User } from 'apps/users/src/db/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async saveRefreshToken(refreshTokenData: {
    user: User;
    token: string;
  }): Promise<void> {
    const { user, token } = refreshTokenData;

    const refreshToken = this.refreshTokenRepository.create({
      userId: user.id,
      refreshToken: token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней жизни токена
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

  async findRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: { refreshToken: token },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    const refreshToken = await this.findRefreshTokenByToken(token);

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    await this.refreshTokenRepository.remove(refreshToken);
  }
}
