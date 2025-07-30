// chat/infra/chat.prisma-repo.ts
import { Injectable } from '@nestjs/common';
import {
  ChatRepository,
  MessageWithSender,
} from '../repositories/chat.repository';
import { SendMessageDto } from '../dtos/send-message.dto';
import { Message, MessageType } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PrismaChatRepository implements ChatRepository {
  constructor(private prisma: PrismaService) {}

  saveMessage(dto: SendMessageDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content: dto.content,
        type: dto.type.toUpperCase() as MessageType,
        fileUrl: dto.fileUrl,
        replyTo: dto.replyTo,
        groupId: dto.groupId,
        senderId: dto.senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  getGroupMessages(groupId: string): Promise<MessageWithSender[]> {
    return this.prisma.message.findMany({
      where: { groupId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
