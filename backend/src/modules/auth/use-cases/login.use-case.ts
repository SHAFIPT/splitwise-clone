import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { IAuthRepository } from '../repositories/auth.repository';
import { TokenService } from '../services/token.service';
import { HashUtil } from 'src/shared/utils/hash.util';
import { AuthMessages } from 'src/constants/messages.constant';
import { IAuthRepositoryToken } from 'src/constants/auth.tokens';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IAuthRepositoryToken)
    private readonly authRepo: IAuthRepository,
    private readonly tokenService: TokenService,
    private readonly hashUtil: HashUtil,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.authRepo.findByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);

    const isMatch = await this.hashUtil.compare(dto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user.id);
    const hashedRefreshToken = await this.hashUtil.hash(refreshToken);
    await this.authRepo.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken, // return to controller so it can set the cookie
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
