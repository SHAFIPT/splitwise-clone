import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type RefreshTokenPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userId: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: '15m' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }
  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(token, {
      secret: process.env.JWT_REFRESH_SECRET, // make sure this is set
    });
  }
}
