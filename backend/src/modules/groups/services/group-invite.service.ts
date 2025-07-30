import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthMessages } from 'src/constants/messages.constant';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GroupInviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateInviteLink(groupId: string, userId: string): Promise<string> {
    // 1. Ensure the user is part of the group - FIXED QUERY
    const group = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!group) {
      throw new UnauthorizedException(AuthMessages.NOT_A_MEMBER);
    }

    // 2. Generate a unique token (JWT)
    const token = this.jwtService.sign(
      { groupId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expires in 7 days

    // 3. Save token in GroupInviteToken table
    await this.prisma.groupInviteToken.create({
      data: {
        token,
        groupId,
        createdById: userId,
        expiresAt,
      },
    });

    // 4. Return invite URL
    return `http://localhost:3000/join/${token}`;
  }

  async decodeInviteToken(token: string): Promise<{ groupId: string }> {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
