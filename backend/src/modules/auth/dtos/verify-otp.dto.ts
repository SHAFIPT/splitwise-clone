export class VerifyOtpDto {
  email!: string;
  code!: string;
  type!: 'register' | 'forgot-password';
}
