import { User } from 'generated/prisma';
import { RegisterDto } from '../dtos/register.dto';

export interface IAuthRepository {
  createUser(data: RegisterDto & { password: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  updateRefreshToken(userId: string, hashedToken: string): Promise<void>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  clearRefreshToken(userId: string): Promise<void>;
}
