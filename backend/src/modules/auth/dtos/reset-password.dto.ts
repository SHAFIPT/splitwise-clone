export class ResetPasswordDto {
  email!: string;
  otpCode!: string;
  newPassword!: string;
}
