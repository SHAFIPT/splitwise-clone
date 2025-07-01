export class SendOtpDto {
  email!: string;
  type!: 'register' | 'forgot-password';
}
