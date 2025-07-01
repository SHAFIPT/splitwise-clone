import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../repositories/auth.repository';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'generated/prisma';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: RegisterDto & { password: string }): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async updateRefreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }
  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }
  async clearRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
