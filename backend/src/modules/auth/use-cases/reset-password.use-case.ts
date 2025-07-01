import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthRepository } from '../repositories/auth.repository';
import { OtpService } from '../services/otp.service';
import { HashUtil } from 'src/shared/utils/hash.util';
import { AuthMessages } from 'src/constants/messages.constant';
import { IAuthRepositoryToken } from 'src/constants/auth.tokens';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(IAuthRepositoryToken)
    private readonly authRepo: IAuthRepository,
    private readonly otpService: OtpService,
    private readonly hashUtil: HashUtil,
  ) {}

  async execute({
    email,
    otpCode,
    newPassword,
  }: {
    email: string;
    otpCode: string;
    newPassword: string;
  }) {
    const isVerified = await this.otpService.verifyOtp(
      email,
      otpCode,
      'forgot-password',
    );
    if (!isVerified) throw new UnauthorizedException(AuthMessages.INVALID_OTP);

    const hashed = await this.hashUtil.hash(newPassword);
    await this.authRepo.updatePassword(email, hashed);
    return { message: AuthMessages.PASSWORD_UPDATED };
  }
}
