import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat.repository';
import { SendMessageDto } from '../dtos/send-message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class SendMessageUseCase {
  constructor(private repo: ChatRepository) {}

  execute(dto: SendMessageDto): Promise<Message> {
    // Add validation, filters, notifications, etc. here as needed
    return this.repo.saveMessage(dto);
  }
}
