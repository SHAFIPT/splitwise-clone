import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IAuthRepository } from '../repositories/auth.repository';
import { RegisterDto } from '../dtos/register.dto';
import { TokenService } from '../services/token.service';
import { HashUtil } from '../../../shared/utils/hash.util';
import { AuthMessages } from 'src/constants/messages.constant';
import { IAuthRepositoryToken } from 'src/constants/auth.tokens';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IAuthRepositoryToken)
    private readonly authRepo: IAuthRepository,
    private readonly tokenService: TokenService,
    private readonly hashUtil: HashUtil,
  ) {}

  async execute(dto: RegisterDto) {
    const existingUser = await this.authRepo.findByEmail(dto.email);
    if (existingUser)
      throw new ConflictException(AuthMessages.EMAIL_ALREADY_EXISTS);

    const hashedPassword = await this.hashUtil.hash(dto.password);
    const user = await this.authRepo.createUser({
      ...dto,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user.id);
    const hashedRefreshToken = await this.hashUtil.hash(refreshToken);
    await this.authRepo.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken, // needed in controller to set cookie
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
