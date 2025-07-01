import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { AuthMessages } from 'src/constants/messages.constant';

@Injectable()
export class VerifyOtpUseCase {
  constructor(private readonly otpService: OtpService) {}

  async execute({
    email,
    code,
    type,
  }: {
    email: string;
    code: string;
    type: string;
  }) {
    const isValid = await this.otpService.verifyOtp(email, code, type);
    if (!isValid)
      throw new UnauthorizedException(AuthMessages.INVALID_OTP_OR_EXPIRED);

    return { message: AuthMessages.OTP_VERIFIED };
  }
}
