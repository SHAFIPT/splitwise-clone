import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service'; // Assume Prisma
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class PrismaProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }
}
