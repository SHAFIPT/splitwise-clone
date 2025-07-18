import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  async saveOtp(email: string, code: string, type: string) {
    // Clean old OTPs for this user/type
    await this.prisma.otp.deleteMany({
      where: { email, type },
    });
  
    // Save new OTP
    await this.prisma.otp.create({
      data: {
        email,
        code,
        type,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes validity
      },
    });
  }

  async verifyOtp(email: string, code: string, type: string): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        email,
        code,
        type,
        verified: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) return false;

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { verified: true },
    });
    return true;
  }
}
