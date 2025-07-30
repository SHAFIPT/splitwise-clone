// chat/repositories/chat.repository.ts
import { Message } from '@prisma/client';
import { SendMessageDto } from '../dtos/send-message.dto';

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface ChatRepository {
  saveMessage(dto: SendMessageDto): Promise<Message>;
  getGroupMessages(groupId: string): Promise<MessageWithSender[]>;
}
