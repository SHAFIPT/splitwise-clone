// src/modules/auth/services/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

console.log('This is the user in the .env', process.env.MAIL_USER);

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, // use true for port 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOtpEmail(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"SplitEase" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${code}`,
      html: `<p>Your OTP code is <strong>${code}</strong>. It is valid for 2 minutes.</p>`,
    });
  }
}
