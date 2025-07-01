// src/modules/auth/use-cases/refresh-token.use-case.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { IAuthRepository } from '../repositories/auth.repository';
import { IAuthRepositoryToken } from 'src/constants/auth.tokens';
import { Inject } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { HashUtil } from 'src/shared/utils/hash.util';
import { AuthMessages } from 'src/constants/messages.constant';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IAuthRepositoryToken)
    private readonly authRepo: IAuthRepository,
    private readonly tokenService: TokenService,
    private readonly hashUtil: HashUtil,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(AuthMessages.UNAUTHORIZED);
    }

    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.authRepo.findByEmail(payload.email);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(AuthMessages.UNAUTHORIZED);
    }

    const isMatch = await this.hashUtil.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isMatch) {
      throw new ForbiddenException(AuthMessages.INVALID_REFRESH_TOKEN);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.tokenService.generateTokens(user.id);

    const hashedRefreshToken = await this.hashUtil.hash(newRefreshToken);
    await this.authRepo.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
