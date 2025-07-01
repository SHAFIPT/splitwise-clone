import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendOtpEmail(email: string, code: string): Promise<void> {
    // Simulate async or plan to use actual email sending
    await Promise.resolve(); // remove later when you integrate real email service
    console.log(`Send email to ${email} with OTP: ${code}`);
  }
}
