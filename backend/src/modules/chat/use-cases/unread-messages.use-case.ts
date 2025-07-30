import { Injectable } from '@nestjs/common';
import { UnreadMessagesRepository } from '../repositories/unread-messages.repository';

@Injectable()
export class UnreadMessagesUseCase {
  constructor(private repo: UnreadMessagesRepository) {}

  markAsUnread(userId: string, messageId: string, groupId: string) {
    return this.repo.createUnread(userId, messageId, groupId);
  }

  clearUnread(userId: string, groupId: string) {
    return this.repo.deleteUnread(userId, groupId);
  }

  countUnread(userId: string, groupId: string) {
    return this.repo.countUnread(userId, groupId);
  }

  getGroupUserIds(groupId: string): Promise<string[]> {
    return this.repo.getUserIdsInGroup(groupId);
  }
}
