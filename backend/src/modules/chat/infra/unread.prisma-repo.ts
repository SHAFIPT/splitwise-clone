import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UnreadMessagesRepository } from '../repositories/unread-messages.repository';

@Injectable()
export class PrismaUnreadMessagesRepository
  implements UnreadMessagesRepository
{
  constructor(private prisma: PrismaService) {}

  async createUnread(
    userId: string,
    messageId: string,
    groupId: string,
  ): Promise<void> {
    await this.prisma.unreadMessage.create({
      data: { userId, messageId, groupId },
    });
  }

  async deleteUnread(userId: string, groupId: string): Promise<void> {
    await this.prisma.unreadMessage.deleteMany({
      where: { userId, groupId },
    });
  }

  countUnread(userId: string, groupId: string): Promise<number> {
    return this.prisma.unreadMessage.count({
      where: { userId, groupId },
    });
  }

  async getUserIdsInGroup(groupId: string): Promise<string[]> {
    const members = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
    return members?.members.map((u) => u.id) || [];
  }
}
