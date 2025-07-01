import { Injectable } from '@nestjs/common';
import { SendOtpUseCase } from './send-otp.use-case';
import { OTP_TYPES } from 'src/shared/constants/otp-types';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly sendOtp: SendOtpUseCase) {}

  async execute(email: string) {
    return this.sendOtp.execute({ email, type: OTP_TYPES.FORGOT_PASSWORD });
  }
}
