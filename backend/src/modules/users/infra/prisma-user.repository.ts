import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserRepository } from '../repository/user.repository';
import { PublicUser } from '../dtos/public-user.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUsersByEmail(
    email: string,
    excludeUserId: string,
  ): Promise<PublicUser[]> {
    return this.prisma.user.findMany({
      where: {
        email: {
          startsWith: email,
          mode: 'insensitive',
        },
        id: {
          not: excludeUserId,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });
  }
}
