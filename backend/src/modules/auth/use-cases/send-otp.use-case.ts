import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuthRepository } from '../repositories/auth.repository';
import { OtpService } from '../services/otp.service';
import { MailService } from '../services/mail.service';
import { AuthMessages } from 'src/constants/messages.constant';
import { IAuthRepositoryToken } from 'src/constants/auth.tokens';

@Injectable()
export class SendOtpUseCase {
  constructor(
    @Inject(IAuthRepositoryToken)
    private readonly authRepo: IAuthRepository,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async execute({ email, type }: { email: string; type: string }) {
    const user = await this.authRepo.findByEmail(email);
    if (type === 'register' && user)
      throw new ConflictException(AuthMessages.EMAIL_ALREADY_EXISTS);
    if (type === 'forgot-password' && !user)
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpService.saveOtp(email, code, type);
    await this.mailService.sendOtpEmail(email, code);

    return { message: AuthMessages.OTP_SENT };
  }
}
