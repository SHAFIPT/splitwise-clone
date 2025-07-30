import { Injectable } from '@nestjs/common';
import {
  ChatRepository,
  MessageWithSender,
} from '../repositories/chat.repository';

@Injectable()
export class GetMessagesUseCase {
  constructor(private repo: ChatRepository) {}

  execute(groupId: string): Promise<MessageWithSender[]> {
    return this.repo.getGroupMessages(groupId);
  }
}
